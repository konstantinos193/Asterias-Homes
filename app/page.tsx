import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Αστεριας Κορωνησια | Asterias Homes Koronisia Arta Greece',
  description: 'Αστεριας Κορωνησια - Traditional holiday apartments in Koronisia, Arta, Greece by the Amvrakikos Gulf. Book online with instant confirmation.',
  alternates: {
    canonical: 'https://asteriashome.gr',
  },
}

export default function RootPage() {
	// Redirect to default language
	redirect('/en')
}
