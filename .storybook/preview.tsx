import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.css'
import { Quicksand } from 'next/font/google'
import { clsx } from 'clsx'


const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand'
})

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    decorators: [
        (Story) => (
            <div className={clsx(quicksand.className, 'bg-red-500 p-10')}>
                <Story/>
            </div>
        )
    ]
}

export default preview