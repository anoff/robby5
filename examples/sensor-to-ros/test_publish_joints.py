#!/usr/bin/python

# publish different values for non-fixed joint(s)

import rospy
from sensor_msgs.msg import JointState

# angle limits [rad]
MIN = -1.5
MAX = 1.5
# step size [rad]
DEL = 0.03
# current angle [rad]
angle = MIN

def incr_angle():
    '''Increment angle and return new value.'''
    global angle
    global DEL
    angle += DEL
    if angle > MAX:
        DEL = -DEL
    return angle

def publish_joints():
    '''Periodically publish the joing angle value.'''
    rospy.init_node('joint_tester')
    pub = rospy.Publisher('joints', JointState, queue_size=10)
    loop_duration_sec = 0.1
    rate = rospy.Rate(1 / loop_duration_sec)
    while not rospy.is_shutdown():
        # fill message -- begin
        msg = JointState()
        msg.header.stamp = rospy.Time.now()
        msg.name.append('sonar_r0_to_base_link')
        msg.position.append(incr_angle())
        msg.velocity.append(DEL / loop_duration_sec)
        # fill message -- end
        assert len(msg.name) == len(msg.position) == len(msg.velocity), 'length of all vectors of this message need to be the same'
        assert len(msg.effort) == 0, 'do not use effort -- or add it to the other assert'
        pub.publish(msg)
        rate.sleep()

if __name__ == '__main__':
    try:
        publish_joints()
    except rospy.ROSInterruptException:
        pass
