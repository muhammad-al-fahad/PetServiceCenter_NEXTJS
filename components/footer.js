import Link from 'next/link'
const Footer = () => {
    return (
        <footer>
            <div className='waves'>
                <div className='wave' id='wave1'></div>
                <div className='wave' id='wave2'></div>
                <div className='wave' id='wave3'></div>
                <div className='wave' id='wave4'></div>
            </div> 
            <ul className="social_icon">
                <li><Link href="https://www.facebook.com"><ion-icon name="logo-facebook"></ion-icon></Link></li>
                <li><Link href="https://www.twitter.com"><ion-icon name="logo-twitter"></ion-icon></Link></li>
                <li><Link href="https://www.linkedin.com"><ion-icon name="logo-linkedin"></ion-icon></Link></li>
                <li><Link href="https://www.instagram.com"><ion-icon name="logo-instagram"></ion-icon></Link></li>
                <li><Link href="https://www.github.com"><ion-icon name="logo-github"></ion-icon></Link></li>
                <li><Link href="https://www.youtube.com"><ion-icon name="logo-youtube"></ion-icon></Link></li>
            </ul>
            <ul className="menu">
                <li><Link href="/"><a className="mx-4"> Home </a></Link></li>
                <li><Link href="/product"><a className="mx-4"> Product </a></Link></li>
                <li><Link href="/offers"><a className="mx-4"> Offer </a></Link></li>
                <li><Link href="/bill"><a className="mx-4"> Bill </a></Link></li>
                <li><Link href="/memberships"><a className="mx-4"> Membership </a></Link></li>
                <li><Link href="/doctors"><a className="mx-4"> Doctor </a></Link></li>
            </ul>
            <p>@2023 Pets Service Center | Copyright Claim</p>
        </footer>
    )
}

export default Footer