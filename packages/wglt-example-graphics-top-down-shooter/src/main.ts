import type { Color, TileMapCell } from 'wglt';
import {
  FONT_8X8,
  fromHsv,
  GraphicsApp,
  Key,
  Rect,
  SimplePalette,
  Sound,
  Sprite,
  TileMap,
  TileMapRenderer,
  Vec2,
} from 'wglt';
import tileMapXml from './map.tmx?raw';

const SCREEN_WIDTH = 1280;
const SCREEN_HEIGHT = 720;
const MAP_WIDTH = 256;
const MAP_HEIGHT = 128;
const TILE_SIZE = 16;
const TEXTURE_SIZE = 2048;

const abs = Math.abs;
const mod = (x: number) => x - Math.floor(x);
const vec2 = (x?: number, y?: number) => new Vec2(x ?? 0, y ?? x ?? 0);
const rand = (min: number, max: number): number => Math.random() * (max - min) + min;

// biome-ignore format: long line
const soundShoot = new Sound([, , 90, , 0.01, 0.03, 4, , , , , , , 9, 50, 0.2, , 0.2, 0.01]);
// biome-ignore format: long line
const soundWalk = new Sound([0.1, 0.1, 300, 0.005, 0.005, 0.01, 4, , , , , , , , , 0.1, , 0.5, 0.005]);
// biome-ignore format: long line
const soundDoorOpening = new Sound([0.3, 0, 100, 0.1, , 0.05, 3, 3.5, , -25, , , , , 1, 0.1, , 0.5, 0.1, , -1200]);
// biome-ignore format: long line
const soundEnemyDied = new Sound([0.5, 0, 59, 0.04, 0.08, 0.55, 4, 3.5, -7, , , , , 0.5, , 1, , 0.32, 0.12]);
// biome-ignore format: long line
const soundDoorUnlock = new Sound([, 0, 209, 0.01, 0.2, 0.08, , 1.8, , , -168, 0.14, , , , 0.1, , 0.59, 0.17]);
// biome-ignore format: long line
const soundPickupKey = new Sound([, 0, 612, , 0.09, 0.11, 1, 1.8, , , 376, 0.09, 0.03, , , , , 0.95, 0.03]);
// biome-ignore format: long line
const soundHeal = new Sound([, 0, 280, 0.03, 0.03, 0.15, 1, 3.8, , , 157, 0.04, , 0.1, 7.2, 0.1, , 0.7, 0.04, , 150]);
// biome-ignore format: long line
const soundPickupAmmo = new Sound([2.1, 0, 372, 0.02, , 0.06, , , , , 360, 0.07, , , , 0.1, 0.02, 0.74, 0.02]);
// biome-ignore format: long line
const soundHacked = new Sound([2, 0, 87, 0.09, 0.16, 0.36, 5, 0.14, 1, , , , 0.05, 0.1, 23, 0.5, 0.18, 0.33, 0.15]);

class Entity extends Rect {
  readonly game: Game;
  isStatic: boolean = false;
  velocity: Vec2 = new Vec2(0, 0);
  mirror?: boolean;
  sprite?: Sprite;
  frame: number = 0;
  destroyed?: boolean;
  health = 0;
  maxHealth = 0;
  debrisColor: Color = fromHsv(140 / 360, 0.7, 0.7);

  constructor(game: Game, x: number, y: number, width: number, height: number) {
    // The constructor (x, y) is the bottom-center of the entity
    // We need to adjust that to the top-left for the Rect constructor
    const leftX = x - width * 0.5;
    const topY = y - height;
    super(leftX, topY, width, height);
    this.game = game;
    this.game.entities.push(this);
  }

  update(): void {
    if (this.game.tileMap.moveAndCollide(this, this.velocity)) {
      this.collideWithTile();
    }
  }

  render(): void {
    if (this.sprite) {
      const x = this.x + this.width * 0.5 - this.sprite.width * 0.5 - this.game.viewport.x;
      const y = this.y + this.height - this.sprite.height - this.game.viewport.y;
      this.sprite.draw(this.game, x, y, this.mirror ?? false, this.frame);
    }
  }

  /**
   * Called to check if a tile collision should be resolved
   * @return          - true if the collision should be resolved
   */
  collideWithTile(): boolean {
    // default: do nothing, subclasses can override
    return true;
  }

  /**
   * Called to check if a object collision should be resolved
   * @param obj - the object to test against
   * @return true if the collision should be resolved
   */
  collideWithObject(_obj: Entity): boolean {
    // default: do nothing, subclasses can override
    return true;
  }

  destroy(): void {
    this.destroyed = true;
  }

  distanceTo(other: Entity): number {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  walkToward(other: Entity, speed: number): void {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0) {
      this.velocity.x += (dx / dist) * speed;
      this.velocity.y += (dy / dist) * speed;
    }
  }

  takeDamage(amount: number) {
    this.health = Math.max(this.health - amount, 0);
    if (this.health <= 0) {
      soundEnemyDied.play();
      this.destroy();
    }
  }

  renderHealthBar(): void {
    if (this.health > 0 && this.health < this.maxHealth) {
      const healthPercent = this.health / this.maxHealth;
      this.drawProgressBar(healthPercent, fromHsv(0, 0.6, 0.6));
    }
  }

  drawProgressBar(percent: number, color: Color): void {
    const x = this.x + this.width * 0.5 - 16 - this.game.viewport.x;
    const y = this.y + this.height - this.game.viewport.y - 10;
    this.game.drawImage(x, y, 1632, 160, 32, 32);
    this.game.drawRect(x + 10, y + 15, 12 * percent, 1, color);
  }
}

class Player extends Entity {
  static IDLE_SPRITE = new Sprite(32, 32, 32, 32, 1);
  static RUN_SPRITE = new Sprite(0, 128, 32, 32, 4);
  static SHOOT_SPRITE = new Sprite(0, 160, 32, 32, 1);

  ammo: number;
  shootDir: Vec2;
  walkCyclePercent: number = 0;
  walkSoundTime: number = 0;
  nearestComputer: Computer | undefined;
  // screenShakeTimer: Timer;
  shooting: boolean = false;
  keyCount = 0;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16, 16);
    this.health = 100;
    this.maxHealth = 100;
    this.ammo = 0;
    this.shootDir = vec2(1, 0); // initially facing right
  }

  update() {
    const acceleration = 0.5;
    const deceleration = 0.6;
    if (this.game.keyboard.isKeyDown(Key.VK_UP)) {
      this.velocity.y -= acceleration;
    } else if (this.game.keyboard.isKeyDown(Key.VK_DOWN)) {
      this.velocity.y += acceleration;
    } else {
      this.velocity.y *= deceleration;
    }

    if (this.game.keyboard.isKeyDown(Key.VK_LEFT)) {
      this.velocity.x -= acceleration;
      this.mirror = true;
    } else if (this.game.keyboard.isKeyDown(Key.VK_RIGHT)) {
      this.velocity.x += acceleration;
      this.mirror = false;
    } else {
      this.velocity.x *= deceleration;
    }

    const maxSpeed = 3.0;
    let speed = this.velocity.length();
    if (speed > maxSpeed) {
      this.velocity.scale(maxSpeed / speed);
      speed = maxSpeed;
    }

    if (speed > 0.5) {
      this.shootDir.x = this.velocity.x / speed;
      this.shootDir.y = this.velocity.y / speed;
    }

    // Call parent and update physics
    super.update();

    // Update walk cycle
    this.walkCyclePercent += (speed * 0.1) / 8;
    this.walkCyclePercent = speed > 0.01 ? mod(this.walkCyclePercent) : 0;

    // Update walk sound
    this.walkSoundTime += speed * 0.03;
    if (speed > 0.02) {
      if (this.walkSoundTime > 1) {
        this.walkSoundTime = this.walkSoundTime % 1;
        soundWalk.play();
      }
    } else {
      this.walkSoundTime = 0;
    }

    // Shoot when space is pressed
    this.shooting =
      this.game.keyboard.isKeyDown(Key.VK_SPACE) || this.game.keyboard.isKeyDown(Key.VK_Z);
    if (this.shooting) {
      this.shoot();
    }

    // Find nearest computer
    this.nearestComputer = this.getNearestComputer();
    if (this.nearestComputer) {
      const hackKeyDown = this.game.keyboard.isKeyDown(Key.VK_X);
      if (hackKeyDown && this.nearestComputer.percentHacked < 1) {
        this.nearestComputer.percentHacked = Math.min(this.nearestComputer.percentHacked + 0.01, 1);
        if (this.nearestComputer.percentHacked >= 1) {
          this.nearestComputer.kill();
          //this.screenShakeTimer.set(1);
          soundHacked.play();
        }
      }
    }

    // Update sprite
    if (this.shooting) {
      this.sprite = Player.SHOOT_SPRITE;
      this.frame = 0;
    } else if (speed > 0.01) {
      this.sprite = Player.RUN_SPRITE;
      this.frame = (4 * this.walkCyclePercent) | 0;
    } else {
      this.sprite = Player.IDLE_SPRITE;
      this.frame = 0;
    }

    // Update camera position with screen shake
    const marginX = this.game.width * 0.45;
    const marginY = this.game.height * 0.4;
    if (this.x - this.game.viewport.x < marginX) {
      this.game.viewport.x = this.x - marginX;
    }
    if (this.game.viewport.x2 - this.x < marginX) {
      this.game.viewport.x = this.x + marginX - this.game.viewport.width;
    }
    if (this.y - this.game.viewport.y < marginY) {
      this.game.viewport.y = this.y - marginY;
    }
    if (this.game.viewport.y2 - this.y < marginY) {
      this.game.viewport.y = this.y + marginY - this.game.viewport.height;
    }
    this.game.viewport.x = Math.round(this.game.viewport.x);
    this.game.viewport.y = Math.round(this.game.viewport.y);
  }

  shoot() {
    if (this.ammo <= 0) {
      console.log('No ammo!');
      return;
    }

    this.ammo -= 1;

    // Create bullet
    const velocity = new Vec2(
      this.shootDir.x * 8 + rand(-0.5, 0.5),
      this.shootDir.y * 8 + rand(-0.5, 0.5)
    );
    const bulletX = this.x + this.width * 0.5 + this.shootDir.x * 2;
    const bulletY = this.y + this.height * 0.7 + this.shootDir.y * 2;
    new Bullet(this, bulletX, bulletY, velocity);

    // Kickback
    this.velocity.x -= this.shootDir.x * 0.2;
    this.velocity.y -= this.shootDir.y * 0.2;

    // Play shoot sound
    soundShoot.play();
  }

  getNearestComputer(): Computer | undefined {
    let nearestComputer: Computer | undefined;
    let nearestDist = 48;
    for (const obj of this.game.entities) {
      if (obj instanceof Computer && !obj.destroyed) {
        const dist = this.distanceTo(obj);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestComputer = obj;
        }
      }
    }
    return nearestComputer;
  }
}

class Enemy extends Entity {
  static SPRITE = new Sprite(19 * 32, 1 * 32, 32, 32, 4);
  chaseSpeed: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16, 16);
    this.sprite = Enemy.SPRITE;
    this.health = this.maxHealth = 75;
    this.chaseSpeed = 0.5;
  }

  update() {
    super.update();

    const player = this.game.player;
    const dist = this.distanceTo(player);

    this.velocity.x *= 0.8;
    this.velocity.y *= 0.8;

    // Chase AI - move toward player
    if (player.health > 0 && dist < 200) {
      this.walkToward(player, this.chaseSpeed);
    }

    // Damage player on collision
    if (player.health > 0 && dist < 24) {
      player.takeDamage(1);
    }

    // Update mirror
    if (abs(this.velocity.x) > 0.01) {
      this.mirror = this.velocity.x < 0;
    }

    this.frame = ((this.game.time * 4) % 4) | 0;
  }
}

class BigEnemy extends Entity {
  static SPRITE = new Sprite(608, 256, 32, 32, 4);
  chaseSpeed: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 24, 48);
    this.sprite = BigEnemy.SPRITE;
    this.health = this.maxHealth = 500;
    this.chaseSpeed = 0.05;
  }

  update() {
    super.update();

    const player = this.game.player;
    const dist = this.distanceTo(player);

    // Chase AI - move toward player
    if (player.health > 0 && dist < 200) {
      this.walkToward(player, this.chaseSpeed);
    }

    // Damage player on collision
    if (player.health > 0 && dist < 24) {
      player.takeDamage(2);
    }

    // Update mirror
    if (abs(this.velocity.x) > 0.01) {
      this.mirror = this.velocity.x < 0;
    }

    this.frame = ((this.game.time * 6) % 4) | 0;
  }
}

class BossEnemy extends Entity {
  static SPRITE = new Sprite(960, 128, 64, 64, 8);
  chaseSpeed: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 64, 64);
    this.sprite = BossEnemy.SPRITE;
    this.health = this.maxHealth = 1000;
    this.chaseSpeed = 0.25;
  }

  update() {
    super.update();

    this.velocity.x *= 0.8;
    this.velocity.y *= 0.8;

    const player = this.game.player;
    const dist = this.distanceTo(player);
    if (player.health > 0 && dist < 300) {
      // Chase AI - move toward player
      this.walkToward(player, this.chaseSpeed);

      // Try to shoot
      this.shoot();

      // Damage player on collision
      if (dist < 32) {
        player.takeDamage(5);
      }
    }

    // Update mirror
    if (abs(this.velocity.x) > 0.01) {
      this.mirror = this.velocity.x < 0;
    }

    this.frame = ((this.game.time * 8) % 8) | 0;
  }

  shoot() {
    const player = this.game.player;
    if (!player || Math.random() > 0.1) {
      return;
    }

    // // Create bullet
    // const bulletSpeed = 0.5;
    // const bulletSpread = 0.1;
    // const shootDir = player.pos.subtract(this.pos).normalize();
    // const direction = shootDir.scale(bulletSpeed);
    // const velocity = direction.rotate(rand(-1, 1) * bulletSpread);
    // const bulletPos = this.pos.add(shootDir.scale(0.2));
    // new Bullet(this, bulletPos, velocity, velocity.angle());

    // // Kickback
    // this.velocity = this.velocity.subtract(direction.scale(0.1));

    // Play shoot sound
    soundShoot.play();
  }

  render(): void {
    super.render();
    this.renderHealthBar();
  }
}

class Spawner extends Entity {
  static IDLE_SPRITE = new Sprite(9 * 32, 2 * 32, 32, 32, 4);
  static ACTIVE_SPRITE = new Sprite(9 * 32, 3 * 32, 32, 32, 4);
  nextSpawnTime: number;
  enemyConstructor: typeof Enemy;

  constructor(game: Game, x: number, y: number, enemyConstructor: typeof Enemy) {
    super(game, x, y, 16, 16);
    this.isStatic = true;
    this.enemyConstructor = enemyConstructor;
    this.health = this.maxHealth = 500;
    this.nextSpawnTime = game.time + 2;
  }

  update() {
    super.update();

    const player = this.game.player;
    let playerInRange = false;
    if (player.health > 0 && this.game.time >= this.nextSpawnTime) {
      // const distToPlayer = player ? Math.hypot(this.x - player.x, (this.y - player.y) * 2) : 1000;
      const playerDelta = new Vec2(player.x - this.x, player.y - this.y);
      const distToPlayer = playerDelta.length();
      playerInRange = distToPlayer < 8 * 16; // 8 tiles
      if (playerInRange) {
        playerDelta.normalize().scale(16);
        const enemyX = this.x + this.width / 2 + playerDelta.x;
        const enemyY = this.y + this.height / 2 + playerDelta.y;
        new this.enemyConstructor(this.game, enemyX, enemyY);
        this.nextSpawnTime = this.game.time + 2;
      }
    }

    this.sprite = playerInRange ? Spawner.ACTIVE_SPRITE : Spawner.IDLE_SPRITE;
    this.frame = ((this.game.time * 4) % 4) | 0;
    this.mirror = !!player && player.x < this.x;
  }

  render(): void {
    super.render();
    this.renderHealthBar();
  }
}

class Bullet extends Entity {
  static SPRITE = new Sprite(172, 178, 8, 8);
  shooter: Entity;
  damage: number;

  constructor(shooter: Entity, x: number, y: number, velocity: Vec2) {
    super(shooter.game, x, y, 8, 8);
    this.shooter = shooter;
    this.velocity = velocity;
    this.damage = 10;
    this.sprite = Bullet.SPRITE;
    this.frame = 0;
  }

  /**
   * Called to check if a tile collision should be resolved
   * @return          - true if the collision should be resolved
   */
  collideWithTile() {
    this.kill();
    return false;
  }

  /**
   * Called to check if a object collision should be resolved
   * @param obj - the object to test against
   * @return true if the collision should be resolved
   */
  collideWithObject(obj: Entity): boolean {
    if (
      obj === this.shooter ||
      obj instanceof Bullet ||
      obj instanceof Ammo ||
      obj instanceof HealthKit ||
      obj instanceof DoorKey ||
      obj instanceof Computer
    ) {
      return false;
    }
    if (obj instanceof Door) {
      this.kill();
      return false;
    }
    if (obj instanceof Entity && !obj.destroyed) {
      obj.takeDamage(this.damage);
      this.kill();
      return false;
    }
    return true;
  }

  kill(): void {
    console.log('Bullet killed');
    if (this.destroyed) {
      return;
    }
    this.destroy();

    // // spark effects
    // const emitter = new ParticleEmitter(
    //   this.pos, // position
    //   0, // angle
    //   0, // emitSize
    //   0.1, // emitTime
    //   10, // emitRate
    //   0.5, // emitCone
    //   undefined, // tileInfo
    //   rgb(1, 1, 0), // colorStartA
    //   rgb(1, 0, 0), // colorStartB
    //   rgb(1, 1, 0), // colorEndA
    //   rgb(1, 0, 0), // colorEndB
    //   0.2, // particleTime
    //   0.2, // sizeStart
    //   0, // sizeEnd
    //   0.1, // speed
    //   0.1, // angleSpeed
    //   1, // damping
    //   1, // angleDamping
    //   0.5, // gravity
    //   3.14, // particleCone
    //   0.1, // fade,
    //   0.5, // randomness
    //   true, // collide
    //   true // additive, colorLinear, renderOrder
    // );
    // emitter.trailScale = 1;
    // emitter.restitution = 0.3;
    // emitter.angle = this.velocity.angle() + PI;
  }
}

class Door extends Entity {
  static YELLOW_DOOR_SPRITE = new Sprite(22 * 32, 21 * 32, 32, 32, 4);
  static RED_DOOR_SPRITE = new Sprite(28 * 32, 21 * 32, 32, 32, 4);
  static DOOR_SPRITE = new Sprite(16 * 32, 25 * 32, 32, 32, 12);

  keyLocked: boolean = true;
  hardLocked: boolean = false;
  opening: boolean;
  percentOpen: number; // 0 = closed, 1 = open
  constructor(game: Game, x: number, y: number, keyLocked: boolean, hardLocked: boolean) {
    super(game, x, y, 28, 28);
    this.isStatic = true;
    this.keyLocked = keyLocked;
    this.hardLocked = hardLocked;
    this.opening = false;
    this.percentOpen = 0; // 0 = closed, 1 = open
  }

  update() {
    const player = this.game.player;
    if (!player) {
      return;
    }

    super.update();
    const playerInRange = Math.abs(player.x - this.x) <= 16 && abs(player.y - this.y) <= 32;

    if (this.keyLocked && playerInRange && player.keyCount > 0) {
      this.keyLocked = false;
      player.keyCount -= 1;
      soundDoorUnlock.play();
    }

    const newOpening = !this.keyLocked && !this.hardLocked && playerInRange;
    if (newOpening !== this.opening) {
      this.opening = newOpening;
      soundDoorOpening.play();
    }

    if (newOpening) {
      this.percentOpen = Math.min(this.percentOpen + 0.05, 1);
    } else {
      this.percentOpen = Math.max(this.percentOpen - 0.05, 0);
    }

    if (this.keyLocked) {
      // Draw yellow door
      this.sprite = Door.YELLOW_DOOR_SPRITE;
      this.frame = ((this.game.time * 4) % 4) | 0;
    } else if (this.hardLocked) {
      // Draw red door
      this.sprite = Door.RED_DOOR_SPRITE;
      this.frame = ((this.game.time * 4) % 4) | 0;
    } else {
      this.sprite = Door.DOOR_SPRITE;
      this.frame = (this.percentOpen * 11) | 0;
    }
  }

  collideWithObject(_obj: Entity): boolean {
    const open = this.percentOpen > 0.9;
    return !open;
  }
}

class Computer extends Entity {
  static SPRITE = new Sprite(0 * 32, 18 * 32, 32, 32, 4);
  percentHacked: number; // 0 = un-hacked, 1 = hacked
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 32, 32);
    this.isStatic = true;
    this.sprite = Computer.SPRITE;
    this.percentHacked = 0; // 0 = un-hacked, 1 = hacked
  }

  update() {
    super.update();
    this.frame = ((this.game.time * 4) % 4) | 0;
  }

  render(): void {
    super.render();

    if (this.percentHacked > 0) {
      this.drawProgressBar(this.percentHacked, fromHsv(140 / 360, 0.7, 0.7));
    }
  }

  kill(): void {
    if (this.destroyed) {
      return;
    }
    this.destroy();

    // Find all nearby hard locked doors and unlock them
    for (const obj of this.game.entities) {
      if (obj instanceof Door && obj.hardLocked && this.distanceTo(obj) < 200) {
        obj.hardLocked = false;
        console.log('Unlocked door!');
        // makeDebris(obj.pos, hsl(140 / 360, 0.7, 0.7), 500, 0.1, 0);
      }
    }
  }
}

class DoorKey extends Entity {
  static SPRITE = new Sprite(8 * 32, 22 * 32, 32, 32);
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16, 16);
    this.sprite = DoorKey.SPRITE;
  }

  collideWithObject(obj: Entity): boolean {
    if (obj instanceof Player) {
      obj.keyCount += 1;
      this.destroy();
      soundPickupKey.play();
      return false;
    }
    return true;
  }
}

class Ammo extends Entity {
  static SPRITE = new Sprite(7 * 32, 22 * 32, 32, 32);
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16, 16);
    this.sprite = Ammo.SPRITE;
  }

  collideWithObject(obj: Entity): boolean {
    if (obj instanceof Player) {
      obj.ammo = Math.min(obj.ammo + 50, 1000); // Max ammo
      this.destroy();
      soundPickupAmmo.play();
      return false;
    }
    return true;
  }
}

class HealthKit extends Entity {
  static SPRITE = new Sprite(6 * 32, 22 * 32, 32, 32);
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 16, 16);
    this.sprite = HealthKit.SPRITE;
  }

  collideWithObject(obj: Entity): boolean {
    if (obj instanceof Player) {
      obj.health = Math.min(obj.health + 25, obj.maxHealth);
      this.destroy();
      soundHeal.play();
      return false;
    }
    return true;
  }
}

class Game extends GraphicsApp {
  entities: Entity[];
  player: Player;
  time: number;
  tileMap: TileMap;
  tileMapRenderer: TileMapRenderer;
  readonly viewport: Rect;

  constructor() {
    super(undefined, SCREEN_WIDTH, SCREEN_HEIGHT, { defaultFont: FONT_8X8 });

    this.entities = [];
    this.time = 0;

    this.player = new Player(this, 6, 8);
    this.player.ammo = 200; // Start with some ammo for testing

    const parser = new DOMParser();
    const doc = parser.parseFromString(tileMapXml, 'application/xml');

    const layers = Array.from(doc.getElementsByTagName('data'));
    this.tileMap = new TileMap(
      MAP_WIDTH,
      MAP_HEIGHT,
      3,
      new Rect(0, 0, TILE_SIZE, TILE_SIZE),
      new Rect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE)
    );
    this.tileMapRenderer = new TileMapRenderer(this.gl, this.tileMap);
    this.viewport = new Rect(0, 0, this.width, this.height);
    for (let i = 0; i < layers.length; i++) {
      const csv = layers[i].textContent.trim() as string;
      const rows = csv.split('\n');
      const grid = rows.map((row) => row.split(',').map((num) => parseInt(num, 10)));
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          const tileValue = grid[y][x];
          if (tileValue !== 0) {
            this.tileMap.setTile(x, y, i, tileValue - 1);
            this.tileMap.setSeen(x, y, true);
            const cell = this.tileMap.getCell(x, y) as TileMapCell;
            cell.visible = true;
            if (i === 1) {
              this.tileMap.setBlocked(x, y, true, false);
            }
          } else {
            this.tileMap.setBlocked(x, y, false, false);
          }
        }
      }
    }

    const objects = Array.from(doc.getElementsByTagName('object'));
    for (const object of objects) {
      const name = object.getAttribute('name');
      const x = Math.round(parseFloat(object.getAttribute('x') as string) / TILE_SIZE) * TILE_SIZE;
      const y =
        Math.round(parseFloat(object.getAttribute('y') as string) / TILE_SIZE) * TILE_SIZE +
        TILE_SIZE;
      switch (name) {
        case 'player':
          this.player.x = x;
          this.player.y = y;
          break;
        case 'spawner':
          new Spawner(this, x, y, Enemy);
          break;
        case 'bigSpawner':
          new Spawner(this, x, y, BigEnemy);
          break;
        case 'door':
          new Door(this, x, y, true, false);
          break;
        case 'redDoor':
          new Door(this, x, y, false, true);
          break;
        case 'computer':
          new Computer(this, x, y);
          break;
        case 'key':
          new DoorKey(this, x, y);
          break;
        case 'ammo':
          new Ammo(this, x, y);
          break;
        case 'health':
          new HealthKit(this, x, y);
          break;
        case 'bigEnemy':
          new BigEnemy(this, x, y);
          break;
        case 'boss':
          new BossEnemy(this, x, y);
          break;
        default:
          console.log('Unknown object:', name, x, y);
          break;
      }
    }
  }

  update(): void {
    for (const a of this.entities) {
      for (const b of this.entities) {
        if (
          a !== b &&
          (!a.isStatic || !b.isStatic) &&
          !a.destroyed &&
          !b.destroyed &&
          a.intersects(b) &&
          a.collideWithObject(b) &&
          b.collideWithObject(a)
        ) {
          const aCenterX = a.x + a.width * 0.5;
          const bCenterX = b.x + b.width * 0.5;
          const aCenterY = a.y + a.height * 0.5;
          const bCenterY = b.y + b.height * 0.5;
          const aRatio = b.isStatic ? 1 : a.isStatic ? 0 : 0.5;
          const bRatio = 1 - aRatio;

          const relativeXVelocity = b.velocity.x - a.velocity.x;
          const relativeYVelocity = b.velocity.y - a.velocity.y;

          if (Math.abs(relativeXVelocity) > Math.abs(relativeYVelocity)) {
            if (aCenterX < bCenterX) {
              const dx = b.x - a.x2 + 1;
              a.x += dx * aRatio;
              b.x -= dx * bRatio;
            } else if (aCenterX > bCenterX) {
              const dx = a.x - b.x2 + 1;
              a.x -= dx * aRatio;
              b.x += dx * bRatio;
            }
          } else {
            if (aCenterY < bCenterY) {
              const dy = b.y - a.y2 + 1;
              a.y += dy * aRatio;
              b.y -= dy * bRatio;
            } else if (aCenterY > bCenterY) {
              const dy = a.y - b.y2 + 1;
              a.y -= dy * aRatio;
              b.y += dy * bRatio;
            }
          }
        }
      }
    }

    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      entity.update();
      if (entity.destroyed) {
        this.entities.splice(i, 1);
      }
    }

    const x = this.viewport.x | 0;
    const y = this.viewport.y | 0;
    const animFrame = ((Sprite.globalAnimIndex / 30) | 0) % 2;
    this.tileMapRenderer.draw(x, y, this.viewport.width, this.viewport.height, animFrame);

    for (const entity of this.entities) {
      entity.render();
    }

    const player = this.player;
    // const healthPercent = player.health / player.maxHealth;
    // const ammoPercent = player.ammo / 1000;

    this.drawString(16, 16, `HEALTH ${player?.health.toFixed(0)}`, SimplePalette.WHITE, 2);
    // drawScreenImage(vec2(1664, 64), vec2(64, 32), vec2(136, 48), vec2(128, 64));
    // fillScreenRect(vec2(32, 52), vec2(104 * healthPercent, 6), hsl(0, 0.6, 0.6));

    this.drawString(16, 80, `AMMO ${player?.ammo.toFixed(0)}`, SimplePalette.WHITE, 2);
    // drawScreenImage(vec2(1664, 64), vec2(64, 32), vec2(136, 120), vec2(128, 64));
    // fillScreenRect(vec2(32, 124), vec2(104 * ammoPercent, 6), hsl(0.6, 0.6, 0.6));

    if (player?.nearestComputer) {
      this.drawString(
        player.nearestComputer.x - this.viewport.x - 32,
        player.nearestComputer.y - this.viewport.y - 32,
        'X TO HACK'
      );
    }

    if (player && player.keyCount > 0) {
      for (let i = 0; i < player.keyCount; i++) {
        this.drawImage(32 + i * 40, 180, 256, 704, 32, 32, undefined, 64, 64);
      }
    }

    this.time += 1 / 60;
  }

  drawRect(x: number, y: number, width: number, height: number, color: Color): void {
    // There is an opaque rectangle in the texture at 0,32 of size 32x32
    // We can use that to draw solid color rectangles
    this.drawImage(x, y, 0, 32, 32, 32, color, width, height);
  }
}

new Game();
