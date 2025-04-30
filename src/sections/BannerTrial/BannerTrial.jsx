import Button from '@/components/Button'
import './BannerTrial.scss'


const BannerTrial = () => {
    const titleId = 'banner-title'

    return(
        <section className="banner-trial container"
        aria-labelledby={titleId}>
            <div className="banner-trial__inner">
                <div className="banner-trial__body">
                    <h2 className="banner-trial__title" id={titleId}>
                    Start your free trial today!
                    </h2>
                    <div className="banner-trial__description">
                        <p>This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.</p>
                    </div>
                </div>
                <Button
                className="banner-trial__button"
                label = "Start a Free Trial"
                href= "/subscriptions"
                />
            </div>

        </section>
    )
}

export default BannerTrial