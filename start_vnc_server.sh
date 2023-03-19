DISPLAY=:2
vncserver -kill $DISPLAY > $HOME/.vnc/vnc_startup.log 2>&1
vncserver $DISPLAY \
    -localhost no \
    -depth 24 \
    -geometry 1920x1080 \
    -PasswordFile "$HOME/.vnc/passwd" \
    -SecurityTypes None \
    --I-KNOW-THIS-IS-INSECURE \
    > $HOME/.vnc/vnc_startup.log 2>&1
