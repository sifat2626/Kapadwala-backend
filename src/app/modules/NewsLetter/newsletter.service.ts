import { User } from '../User/user.model'
import { DealServices } from '../Deals/deal.service'
import { EmailService } from '../../utils/email.service'

export const NewsletterService = {
  sendDailyNewsletter: async () => {
    // Step 1: Fetch top 10 deals
    const topDeals = await DealServices.getTopDeals()
    const top10Deals = topDeals.data.slice(0, 10) // Limit to 10 deals

    // Step 2: Fetch all users who are subscribed to the newsletter
    const newsletterSubscribers = await User.find({
      isSubscribedToNewsletter: true, // Ensure they are subscribed to the newsletter
    }).select('newsLetterEmail name favoriteCreditCardVendors')

    if (!newsletterSubscribers.length) {
      console.log('No newsletter subscribers found.')
      return
    }

    // Step 3: Prepare and send the newsletter for each subscriber
    for (const subscriber of newsletterSubscribers) {
      const { favoriteCreditCardVendors, newsLetterEmail } = subscriber

      // Filter credit card deals based on the subscriber's favorite vendors
      const personalizedDeals = top10Deals.map((deal: any) => {
        const filteredCreditCardDeals = deal.creditCardDeals.filter(
          (creditDeal: { vendor: { _id: any } }) =>
            favoriteCreditCardVendors.includes(
              creditDeal.vendor?._id?.toString(),
            ),
        )

        return {
          ...deal,
          creditCardDeals: filteredCreditCardDeals,
        }
      })

      // Generate HTML content for the deals
      const dealsHtml = personalizedDeals
        .map(
          (deal: {
            bestCashbackDeal: { title: any; percentage: any; link: any }
            bestGiftcardDeal: { title: any; percentage: any; link: any }
            creditCardDeals: { vendor: { name: any }; title: any; link: any }[]
            company: { name: any }
          }) => {
            const cashback = deal.bestCashbackDeal
              ? `<li><strong>Cashback:</strong> ${deal.bestCashbackDeal.title} (${deal.bestCashbackDeal.percentage}% off)
                <br/> <a href="${deal.bestCashbackDeal.link}" target="_blank">View Cashback Deal</a>
              </li>`
              : ''

            const giftcard = deal.bestGiftcardDeal
              ? `<li><strong>Gift Card:</strong> ${deal.bestGiftcardDeal.title} (${deal.bestGiftcardDeal.percentage}% off)
                <br/> <a href="${deal.bestGiftcardDeal.link}" target="_blank">View Gift Card Deal</a>
              </li>`
              : ''

            const creditCards = deal.creditCardDeals.length
              ? deal.creditCardDeals
                  .map(
                    (creditDeal: {
                      vendor: { name: any }
                      title: any
                      link: any
                    }) => ` <li><strong>Credit Card:</strong> ${creditDeal.vendor?.name || 'N/A'} - ${creditDeal.title}
                    <br/> <a href="${creditDeal.link}" target="_blank">View Credit Card Deal</a>
                    </li>`,
                  )
                  .join('')
              : '<li>No active credit card deals</li>'

            return `
            <h2>${deal.company.name}</h2>
            <ul>
              ${cashback}
              ${giftcard}
              ${creditCards}
            </ul>
          `
          },
        )
        .join('')

      const emailHtml = `
        <h1>Top 10 Deals of the Day</h1>
        ${dealsHtml}
        <p>Thank you for subscribing to our newsletter!</p>
      `

      // Step 4: Send email to the subscriber
      const subject = 'Your Personalized Daily Top Deals!'
      const text = 'Check out the top deals of the day!'
      try {
        await EmailService.sendEmail(newsLetterEmail, subject, text, emailHtml)
        console.log(`Newsletter sent to ${newsLetterEmail}`)
      } catch (error) {
        console.error(
          `Failed to send email to ${newsLetterEmail}:`,
          (error as any).message,
        )
      }
    }
  },
}
