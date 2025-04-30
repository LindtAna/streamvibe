import { Image } from 'minista'
import './Support.scss'
import Field from '@/components/Field'
import Checkbox from '@/components/Checkbox'
import Button from '@/components/Button'
import Select from '@/components/Select'

import SupportBannerImgSrc from '@/assets/images/support/support.png'

const Support = () => {

    const titleId = 'support-title'

    return (
        <section className="support container"
            aria-labelledby={titleId}>

            <div className="support__body">
                <div className="support__info">
                    <h1 className="support__title h2" id={titleId}>
                        Welcome to our support page!
                    </h1>
                    <div className="support__description">
                        <p>We're here to help you with any problems you may be having with our product.</p>
                    </div>
                </div>
                <Image className="support__image"
                    src = {SupportBannerImgSrc} />
            </div>
            <form className="support__form" action="">
                <Field
                    className="support__form-cell"
                    label="First Name"
                    placeholder="Erika"
                    isRequired
                />

                <Field
                    className="support__form-cell"
                    label="Last Name"
                    placeholder="Musterfrau"
                    isRequired
                />

                <Field
                    className="support__form-cell"
                    label="Email"
                    type="email"
                    placeholder="example@example.com"
                    isRequired
                />

                <Field
                    className="support__form-cell"
                    label="Phone Number"
                    placeholder="(0123) 987-65-43"
                    inputMode="tel"
                    mask="(0000) 000-00-00"
                    renderBefore={(buttonClassName) => (
                        <Select
                            label="Phone number prefix"
                            buttonClassName={buttonClassName}
                            options={[
                                { value: '+49', isSelected: true },
                                { value: '+44' },
                                { value: '+33' },
                                { value: '+39' },
                                { value: '+31' },
                                { value: '+81' },
                                { value: '+385' },
                            ]}
                        />
                    )}
                />

                <Field
                    className="support__form-cell support__form-cell--wide"
                    label="Message"
                    type="textarea"
                    placeholder="Hi! I have a question..."
                    isRequired
                />

                <div className="support__form-cell support__form-cell--wide support__form-cell--actions">

                    <Checkbox className="support__form-agreement"
                        label="I agree with Terms of Use and Privacy Policy"
                        isRequired
                    />
                    <Button className="support__form-submit-button"
                        label="Send Message"
                        type="submit"
                    />
                </div>


            </form>
        </section>
    )
}

export default Support

