import { SearchBar } from '@/components/search-bar/index'
import { Meta, StoryObj } from '@storybook/nextjs'
import { SearchType } from '@/libs/constants/spotify.constant'


const meta = {
    title: 'search-bar/result',
    component: SearchBar.Result,
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
} satisfies Meta<typeof SearchBar.Result>

export default meta
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        imgUrl: 'https://i.scdn.co/image/ab67616d0000b273124e9249fada4ff3c3a0739c',
        title: 'Chromakopia',
        type: SearchType.album,
        subtitle: 'Tyler, The Creator',
        className: '!w-[600px]'
    }
}