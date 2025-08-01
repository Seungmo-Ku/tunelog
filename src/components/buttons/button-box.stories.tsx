import { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from '@/components/buttons/index'
import { Play } from 'lucide-react'


const meta = {
    title: 'buttons/box',
    component: Button.Box,
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
} satisfies Meta<typeof Button.Box>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        text: 'Play All',
        leftIcon: <div className='size-fit bg-tunelog-secondary p-1 rounded-full flex items-center justify-center'><Play className='w-3 h-3 text-tunelog-dark-alt'/></div>
    }
}