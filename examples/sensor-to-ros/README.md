Forward the sensor readings (i.e. ultrasonic) to a ROS system.


# nodejs and ROS

The file [index.js](index.js) uses [rosnodejs](http://wiki.ros.org/rosnodejs)
to output sensor readings as ROS messages.


# ROS robot model

The file [elegooSonars.urdf.xacro](elegooSonars.urdf.xacro) provides an urdf
description of the elegoo robot used.  To view it in rviz, execute (in
different shells):
- `roscore`
- `rviz` (and add the *RobotModel* and *TF* display)
- `roslaunch display_urdf_in_rviz.launch`
- `./test_publish_joints.py`

Look into [`test_publish_joints.py`](test_publish_joints.py) for how to send a
message that will set the angle of the rotating sonar.

To play around with the model, edit the launch file to use `<param
name="use_gui" value="true" />`; a gui should open up with a slider to modify
joint angle values.

To change the model, simply modfiy the `urdf.xacro` file, kill and restart
`roslaunch display_urdf_in_rviz.launch`.  The robot model should update in
rviz, if it does not, uncheck and check the RobotModel display.


# Sensor measurements

Send sensor measurements as
[`sensor_msgs/Range`](http://docs.ros.org/kinetic/api/sensor_msgs/html/msg/Range.html)
message, where in the `header`, the name of the joint (e.g. `sonar_f2` for
fixed sonar 2 or `sonar_r0` for the first rotating sonar) is used as
`frame_id`.

Send a
[`sensor_msgs/JointState`](http://docs.ros.org/kinetic/api/sensor_msgs/html/msg/JointState.html)
with the name and current angle of the moving joint (see
[`test_publish_joints.py`](test_publish_joints.py) for an example).

Ros should be a able to display your readings correctly in rviz.  To display
them, use the *Range* display.
