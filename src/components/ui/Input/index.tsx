import styles from './styles.module.scss';
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({...rest}: InputProps) { // rest são todas as props enviadas para esse input

    return (

        <input className={styles.input} {...rest} />

    );

}

export function TextArea({...rest}: TextAreaProps) {

    return (

        <textarea className={styles.input}  {...rest} ></textarea>

    );

}