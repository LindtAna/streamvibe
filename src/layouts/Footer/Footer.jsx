import Socials from '@/components/Socials'
import './Footer.scss'

import FacebookIcon from '@/assets/icons/facebook.svg'
import XIcon from '@/assets/icons/x.svg'
import LinkedInIcon from '@/assets/icons/linked-in.svg'

const Footer = () => {
    const menuItems = [
        {
            title: 'Home',
            links: ['Categories', 'Devices', 'Pricing', 'FAQ']
        },
        {
            title: 'Movies',
            links: ['Genres', 'Trending', 'New Release', 'Popular']
        },
        {
            title: 'Shows',
            links: ['Genres', 'Trending', 'New Release', 'Popular']
        },
        {
            title: 'Support',
            links: ['Contact Us']
        },
        {
            title: 'Subscription',
            links: ['Plans', 'Features']
        },
        {
            title: 'Connect With Us',
            socialLinks: [
                { label: 'Facebook', iconName: 'facebook', iconSrc: FacebookIcon},
                { label: 'X', iconName: 'x', iconSrc: XIcon},
                { label: 'LinkedIn', iconName: 'linked-in', iconSrc: LinkedInIcon },

            ]
        },
    ]

    const extraLinks = ['Terms of Use', 'Privacy Policy', 'Cookie Policy']
    return (
        <footer className='footer'>
            <div className="footer__inner container">
                <nav className="footer__menu">
                    {menuItems.map(({ title, links, socialLinks }, index) => (
                        <div className="footer__menu-column" key={index}>
                            <a className="footer__menu-title h6" href="/">{title}</a>
                            {links?.length > 0 && (
                                <ul className="footer__menu-list">
                                    {links.map((link, index) => (
                                        <li className="footer__menu-item" key={index}>
                                            <a className="footer__menu-link" href="/" >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {socialLinks?.length > 0 && (
                                <Socials className="footer__soc1als"
                                    links={socialLinks}

                                />
                            )}
                        </div>
                    ))}
                </nav>

                <div className="footer__extra">
                    <p className="footer__copyright">
                        @<time dateTime="2025">2025</time> streamvibe, All Rights Reserved
                    </p>
                    <div className="footer__extra-links">
                        {extraLinks.map((link, index) => (
                            <a className="footer__extra-link" href="/" key={index} >{link}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer