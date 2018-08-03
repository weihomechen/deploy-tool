#! /usr/bin/expect

set timeout 300
set name [lindex $argv 0]
set server [lindex $argv 1]
set wd [lindex $argv 2]
set user [lindex $argv 3]
set pwd [lindex $argv 4]

spawn ssh $user@$server

expect {
"*yes/no" { send "yes\r"; exp_continue }
"*password:" { send "$pwd\r" }
}

expect "#*"
send "cd $wd\r"
send "rm -rf $name\r"
send "tar xzvf $name.tar.gz\r"
send "rm -rf $name.tar.gz\r"
send "mv build $name\r"
send "exit\r"
expect eof
