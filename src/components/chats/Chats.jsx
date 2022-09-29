import React from 'react'
import {Groups} from "./Groups"
import {Users} from "./Users"
import {Group} from "../Group"
import {User} from "../User"

const Chats = ({p,g}) => {
  return (
    <>
    {g.group.map((grupo) => (
          <Group
          user1={g.user1}
          key={grupo.gid}
          grupo={grupo}
          selectGroup={g.selectGroup}
          chat={g.chat}
          descifrar={g.descifrar}
          />
        ))}
        {p.users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={p.selectUser}
            user1={p.user1}
            chat={p.chat}
            descifrar={p.descifrar}
          />
        ))}
    
    </>
  )
}

export {Chats}