import Hero from '../../home/Hero'
import './SavedPublic.scss'

const SavedPublic = () => {
    return (
        <div className="saved-public">
            <Hero>
                <p>
                    Um die gespeicherten Filme anzusehen, musst du dich zuerst
                    registrieren und anmelden.
                    <br />
                    Erstelle kostenlos einen Account, um Filme zu speichern und
                    deine persönliche Merkliste zu verwalten.
                </p>
            </Hero>
        </div>
    )
}

export default SavedPublic