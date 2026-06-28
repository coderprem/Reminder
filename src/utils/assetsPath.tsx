import cross from '../assets/svgs/cross.svg';
import checked from '../assets/svgs/checked.svg';
import unchecked from '../assets/svgs/unchecked.svg';
import tick from '../assets/svgs/tick.svg';
import radio from '../assets/svgs/radio.svg';
import radioSelected from '../assets/svgs/radioSelected.svg';
import menu from '../assets/svgs/menu.svg';
import menuNotification from '../assets/svgs/menuNotification.svg';
import edit from '../assets/svgs/edit.svg';
import androidBack from '../assets/svgs/androidBack.svg';
import iosBack from '../assets/svgs/iosBack.svg';
import plus from '../assets/svgs/plus.svg';
import profile from '../assets/svgs/profile.svg';
import downArrow from '../assets/svgs/downArrow.svg';
import deleteIcon from '../assets/svgs/delete.svg';
import deleteCircle from '../assets/svgs/deleteCircle.svg';
import editCircle from '../assets/svgs/editCircle.svg';
import mobile from '../assets/svgs/mobile.svg';
import fireTv from '../assets/svgs/fireTv.svg';
import tablet from '../assets/svgs/tablet.svg';
import web from '../assets/svgs/web.svg';

export const upArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '180deg'}]}, props.style]}
    />
  )
}


export const rightArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '90deg'}]}, props.style]}
    />
  )
}

export const leftArrow = (props: any) => {
  return (
    <SVGS.downArrow
      {...props}
      style={[{transform: [{rotate: '-90deg'}]}, props.style]}
    />
  )
}


export const SVGS = {
  cross: cross,
  checked: checked,
  unchecked: unchecked,
  tick: tick,
  radio: radio,
  radioSelected: radioSelected,
  menu: menu,
  menuNotification: menuNotification,
  edit: edit,
  androidBack: androidBack,
  iosBack: iosBack,
  plus: plus,
  profile: profile,
  upArrow: upArrow,
  downArrow: downArrow,
  leftArrow: leftArrow,
  rightArrow: rightArrow,
  delete: deleteIcon,
  deleteCircle: deleteCircle,
  editCircle: editCircle,
  mobile: mobile,
  fireTv: fireTv,
  tablet: tablet,
  web: web,
};



export const IMAGES = {
  placeholder: require('../assets/images/placeHolder.png'),
  transparent: require('../assets/images/logo.png'),
};


export const VIDEOS = {
  splash: require('../assets/videos/splashCoco.mp4'),
};
