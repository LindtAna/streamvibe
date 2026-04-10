import Section from '../../../layouts/Section'
import AccordionGroup from '../AccordionGroup'
import Accordion from '../Accordion'

const questionItems = [
  {
    title: 'Was ist StreamVibe?',
    children: 'StreamVibe ist eine Online-Datenbank für Filme und Serien. Du kannst Titel suchen, detaillierte Informationen ansehen und Trailer entdecken.',
  },
  {
    title: 'Ist die Nutzung von StreamVibe kostenlos?',
    children: 'Ja, StreamVibe ist komplett kostenlos. Es gibt keine Abonnements oder versteckte Kosten.',
  },
  {
    title: 'Welche Inhalte finde ich auf StreamVibe?',
    children: 'Du findest Informationen zu Filmen und Serien, darunter Beschreibungen, Bewertungen, Besetzungen, Erscheinungsdaten und Trailer.',
  },
  {
    title: 'Wie kann ich nach Filmen oder Serien suchen?',
    children: 'Nutze einfach die Suchfunktion auf der Website, um Titel, Schauspieler oder bestimmte Inhalte schnell zu finden.',
  },
  {
    title: 'Wie erstelle ich ein Konto bei StreamVibe?',
    children: 'Klicke auf Login-Icon, gib deine Daten ein und bestätige deine Anmeldung – danach kannst du alle Funktionen nutzen.',
  },
  {
    title: 'Was ist die Merkliste?',
    children: 'Mit der Merkliste kannst du Filme und Serien speichern, die du später anschauen oder nicht vergessen möchtest.',
  },
  {
    title: 'Brauche ich ein Konto, um die Merkliste zu nutzen?',
    children: 'Ja, du benötigst ein kostenloses Konto, um Inhalte zu deiner Merkliste hinzuzufügen und zu verwalten.',
  },
  {
    title: 'Wie kann ich Trailer ansehen?',
    children: 'Auf der Detailseite eines Films oder einer Serie kannst du verfügbare Trailer direkt im Browser abspielen.',
  },
]

const Questions = () => {
  return (
    <Section
      title="Frequently Asked Questions"
      titleId="questions-title"
      description="Hast du Fragen? Wir haben die Antworten! Schau dir unseren FAQ-Bereich an und finde Antworten auf die häufigsten Fragen zu StreamVibe."
    >
      <AccordionGroup columns={2}>
        {questionItems.map((question, index) => (
          <Accordion
            key={index}
            title={question.title}
            id={`question-${index}`}
            name="questions"
            isOpen={index === 0}
          >
            {question.children}
          </Accordion>
        ))}
      </AccordionGroup>
    </Section>
  )
}

export default Questions