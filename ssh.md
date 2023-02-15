# SSH

Server
```
sudo apt install openssh-server
sudo systemctl status ssh
sudo ufw allow ssh

sudo systemctl enable/disable/stop/start/restart ssh
curl ifconfig.me
```

Client
```
ssh-keygen

ssh user@ip
```

Management
```
ss | grep ssh
ps aux | grep ssh
kill -9 "user"
```

Ports:
- SSH -> 22
- Vivado -> 3121
