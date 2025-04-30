import Section from '@/layouts/Section'
import Button from '@/components/Button'
import AccordionGroup from '@/components/AccordionGroup'
import Accordion from '@/components/Accordion'

const Questions = () => {
  const questionItems = [
    {
      title: 'What is StreamVibe?',
      children: 'StreamVibe is a streaming service that allows you to watch movies and shows on demand.'
    },
    {
      title: 'How much does StreamVibe cost?',
      children: 'StreamVibe offers several subscription plans starting from $9.99 per month.'
    },
    {
      title: 'What content is available on StreamVibe?',
      children: 'We offer a wide variety of movies, TV shows, documentaries, and exclusive original content.'
    },
    {
      title: 'How can I watch StreamVibe?',
      children: 'You can watch StreamVibe on your smart TV, computer, smartphone, or tablet using our app.'
    },
    {
      title: 'How do I sign up for StreamVibe?',
      children: 'Simply visit our website, choose a subscription plan, and create an account to start streaming.'
    },
    {
      title: 'What is the StreamVibe free trial?',
      children: 'New users can enjoy a 7-day free trial to explore our content before subscribing.'
    },
    {
      title: 'How do I contact StreamVibe customer support?',
      children: 'You can contact our support team 24/7 via email at support@streamvibe.com or through our online chat.'
    },
    {
      title: 'What are the StreamVibe payment methods?',
      children: 'We accept all major credit cards, PayPal, and several other payment methods depending on your region.'
    }
  ]

  return (
    <Section
      title="Frequently Asked Questions"
      titleId="questions-title"
      description="Got questions? We've got answers! Check out our FAQ section to find answers to the most common questions about StreamVibe."
      actions={<Button label="Ask a Question" href="/support" />}
    >
      <AccordionGroup columns={2}>
        {questionItems.map((question, index) => (
          <Accordion
            title={question.title}
            id={`question-${index}`}
            name='questions'
            isOpen={index === 0}
            key={index}
          >
            {question.children}
          </Accordion>
        ))}
      </AccordionGroup>
    </Section>
  )
}

export default Questions