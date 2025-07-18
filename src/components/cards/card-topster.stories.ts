import { Cards } from '@/components/cards/index'
import { Meta, StoryObj } from '@storybook/nextjs'
import { SearchType } from '@/libs/constants/spotify.constant'


const meta = {
    title: 'cards/topster',
    component: Cards.Topster,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered'
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    }
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof Cards.Topster>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        topster: {
            _id: '1',
            title: 'My Topster',
            size: 1,
            author: '구승모',
            showTitles: true,
            showTypes: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            uid: 'sdfdsf',
            components: [
                {
                    type: SearchType.album,
                    spotifyId: 'album1',
                    imageUrl: 'https://via.placeholder.com/150',
                    title: 'Album 1',
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1
                }
            ]
        }
    }
}