import styles from './Modal.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Modal({ title, displayHandle, content, cancelString, confirmString, createOrderHandle }) {
    ;<div className={cx('modal')}>
        <article className={cx('modal-container')}>
            <header className={cx('modal-container-header')}>
                <h1 className={cx('modal-container-title')}>{title}</h1>
                <button className={cx('icon-button')} onClick={displayHandle}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                            fill="currentColor"
                            d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
                        />
                    </svg>
                </button>
            </header>
            <section className={cx('modal-container-body', 'rtf')}>{content}</section>
            <footer className={cx('modal-container-footer')}>
                <div className={cx('button', 'is-ghost')} onClick={displayHandle}>
                    {cancelString}
                </div>
                <div className={cx('button', 'is-primary')} onClick={() => createOrderHandle()}>
                    {confirmString}
                </div>
            </footer>
        </article>
    </div>
}
