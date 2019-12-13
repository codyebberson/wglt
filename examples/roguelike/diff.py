
import html
import subprocess

def diff(old_file, new_file):
    # proc = subprocess.Popen(["diff", "-u", old_file, new_file],
    #     stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    # out, err = proc.communicate()
    # return out
    return subprocess.run(["diff", "-u", old_file, new_file], stdout=subprocess.PIPE).stdout.decode('utf-8')

def diff2html(diff):
    result = ''
    for line in diff.splitlines():
        classname = 'c0'
        if line.startswith('@'):
            classname = 'c1'
        elif line.startswith('+'):
            classname = 'c2'
        elif line.startswith('-'):
            classname = 'c3'
        result = result + '<div class="' + classname + '">' + html.escape(line) + '</div>\n'
    return result

def update_diff(html_file, old_js, new_js):
    snippet = diff2html(diff(old_js, new_js))
    with open(html_file) as f:
        html = f.read()
    start_token = '<!--STARTDIFF-->'
    end_token = '<!--ENDDIFF-->'
    start_index = html.find(start_token) + len(start_token)
    end_index = html.find(end_token, start_index)
    html = html[:start_index] + snippet + html[end_index:]
    with open(html_file, "w") as f:
        f.write(html)

if __name__ == "__main__":
    for i in range(1, 14):
        prev = 'part' + str(i - 1)
        curr = 'part' + str(i)
        update_diff(curr + '.html', prev + '.js', curr + '.js')

