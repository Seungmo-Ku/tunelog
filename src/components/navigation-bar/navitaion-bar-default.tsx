import { NavigationBar } from '@/components/navigation-bar/index'
import { DiscAlbum, GalleryVerticalEnd, House, ListMusic, Music, NotebookPen, SquareUser } from 'lucide-react'
import React from 'react'

/*
 * 대시보드: /dashboard
 * 평가 목록: /ratings
 * 저널: /journals
 * 탑스터: /topsters
 * 앨범 상세: /detail/album
 * 노래 상세: /detail/track
 * 아티스트 상세: /detail/artist
 * */
export interface NavbarComponentProps {
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    path: string
}

export default function Navbar() {
    
    const navbarMainComponents: NavbarComponentProps[] = [
        { Icon: House, path: '/dashboard' },
        { Icon: ListMusic, path: '/ratings' },
        { Icon: NotebookPen, path: '/journals' },
        { Icon: GalleryVerticalEnd, path: '/topsters' }
    ]
    const navbarDetailComponents: NavbarComponentProps[] = [
        { Icon: DiscAlbum, path: '/detail/album' },
        { Icon: Music, path: '/detail/track' },
        { Icon: SquareUser, path: '/detail/artist' }
    ]
    
    return (
        <nav className='h-full shrink-0 px-4 py-2 text-white flex flex-col gap-y-5 justify-start items-center'>
            <NavigationBar.Group components={navbarMainComponents}/>
            <NavigationBar.Group components={navbarDetailComponents}/>
        </nav>
    )
}