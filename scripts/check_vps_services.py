import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('31.97.61.136', 22, 'root', 'C;vx#5kLpR)&&8/9C7-0')

commands = [
    'systemctl list-units --type=service --state=running | grep -E "bg|calc|admin"',
    'ss -tulpn | grep -E "3000|3001|8011"',
    'cat /etc/nginx/sites-available/bgcoating',
    'ls -la /var/www/bgcoating/dist'
]

for cmd in commands:
    print(f"=== {cmd} ===")
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    err = stderr.read().decode()
    if err:
        print(f"ERR: {err}")

client.close()
