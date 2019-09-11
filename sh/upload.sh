#! /usr/bin/expect
set timeout 30
set tgzSrc [lindex $argv 0]
set server [lindex $argv 1]
set wd [lindex $argv 2]
set user [lindex $argv 3]
set pwd [lindex $argv 4]

spawn scp $tgzSrc $user@$server:$wd

expect {
"(yes/no)?"
  {
      send "yes\n"
      expect "*assword:" { send "$pwd\n" }
  }
  "*assword:"
  {
      send "$pwd\n"
  }
} 
expect "100%"
expect eof
