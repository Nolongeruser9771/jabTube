import classNames from 'classnames/bind'
import styles from './MobileSidebar.module.scss'

const cx = classNames.bind(styles)

export default function MobileSidebar() {
    return (
        <div className={cx("nav-outer-container")}>
            <div className={cx("nav-content-container")}>
                {/* <!-- First section --> */}

                <ul className={cx("nav-main-sections-container")}>
                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-home icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Home</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-person icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>My Page</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-flame icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Explore</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-thumbsup icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Favorite</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-time icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>History</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-filing icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Playlist</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                {/* <!-- Library --> */}
                <hr />

                <ul className={cx("nav-main-sections-container")}>
                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <h3 className={cx("nav-main-section-header")}>
                                <a className={cx("nav-main-section-header-a")} href="#">
                                    Search
                                </a>
                            </h3>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-paper icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Genre</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-paper icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Level</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>

                {/* <!-- Break for another section --> */}
                <hr />

                <ul className={cx("nav-main-sections-container")}>
                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-plus icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Browse Channels</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className={cx("nav-main-section")}>
                        <div className={cx("nav-main-section-inner-container")}>
                            <ul className={cx("nav-main-section-links")}>
                                <li className={cx("nav-main-section-link")}>
                                    <a href="#" className={cx("nav-main-section-link-a")}>
                                        <span className={cx("link-container")}>
                                            <span className={cx("nav-link-icon")}>
                                                <i className={cx("ion-ios-gear icon")}></i>
                                            </span>
                                            <span className={cx("nav-link-text")}>Manage Your Package</span>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
