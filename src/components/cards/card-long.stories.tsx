import { Cards } from '@/components/cards/index'
import { Meta, StoryObj } from '@storybook/nextjs'
import { EllipsisVertical, Heart } from 'lucide-react'


const meta = {
    title: 'cards/long',
    component: Cards.Long,
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
} satisfies Meta<typeof Cards.Long>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273124e9249fada4ff3c3a0739c',
        leftIcon: <Heart className='text-white w-5 h-5'/>,
        title: 'Like Him',
        type: 'Chromakopia',
        duration: '4:36',
        rightIcon: <EllipsisVertical className='text-tunelog-secondary w-5 h-5'/>
    }
}