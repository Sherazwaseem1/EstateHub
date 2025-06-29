import { message } from 'antd'
import React from 'react'
import '../CSS_files/Notification.css'

type Props = {
    message: string
    class: boolean
}

const Notification = (props: Props) => {
  return (
      <div className={!props.class?'notification bg-white border border-2 border-emerald-900 w-[23vw] h-[10vh] flex items-center rounded-lg absolute top-[-6rem]':' notification bg-white border border-2 border-emerald-900 w-[23vw] h-[10vh] flex items-center rounded-lg absolute top-[1rem] z-[2000]'}>
          <img className='w-[3vw] mx-2' src="../Images/Notficiation.png" alt="" />
          <div className='test-black'>{props.message}</div>
      </div>
  )
}

export default Notification