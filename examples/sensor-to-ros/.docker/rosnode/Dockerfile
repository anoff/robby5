FROM osrf/ros:kinetic-desktop-full

# Set apt mirror to ucmirror and install extra packages
RUN sed -i "s/http:\/\/archive.ubuntu.com/http:\/\/ucmirror.canterbury.ac.nz/g" /etc/apt/sources.list && \
	apt-get update && \
	apt-get install -y \
		bash-completion \
		ros-kinetic-rosbash \
		nano \
		psmisc && \
	rm -rf /var/lib/apt/lists/*

# Sourcing this before .bashrc runs breaks ROS completions
RUN echo "\nsource /opt/ros/indigo/setup.bash" >> /root/.bashrc

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
#RUN export NVM_DIR="$HOME/.nvm";
#RUN echo "[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh" >> $HOME/.bashrc;
RUN bash -i -c 'nvm install v7';
