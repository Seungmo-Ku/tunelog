import { NavigationBar } from '@/components/navigation-bar/index'
import { DiscAlbum, GalleryVerticalEnd, House, ListMusic, Music, NotebookPen, SquareUser } from 'lucide-react'

/*
 * 대시보드, 평가 목록, 저널, 탑스터
 * 앨범 상세, 노래 상세, 아티스트 상세
 * */
export default function Navbar() {
    return (
        <nav className='h-full shrink-0 px-4 py-2 text-white flex flex-col gap-y-5 justify-start items-center'>
            <NavigationBar.Group icons={[House, ListMusic, NotebookPen, GalleryVerticalEnd]} selectedIndex={0}/>
            <NavigationBar.Group icons={[DiscAlbum, Music, SquareUser]}/>
        </nav>
    )
}