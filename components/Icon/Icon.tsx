import { Icon } from '@iconify/react';
import styles from './Icon.module.css';

interface IconProps {
    icon: string;
}

export default function IconComponent(props: IconProps) {
    return (
        <Icon icon={props.icon} className={styles.icon}/>
    );
}