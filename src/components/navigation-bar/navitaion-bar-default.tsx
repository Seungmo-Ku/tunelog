import { NavigationBar } from '@/components/navigation-bar/index'
import { Compass, DiscAlbum, House, LayoutGrid, Music, NotebookPen, SquareUser, Star } from 'lucide-react'
import React from 'react'
import { useNavbarAuth } from '@/components/navigation-bar/navigation-bar-auth'

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

export const navbarMainComponents: NavbarComponentProps[] = [
    { Icon: House, path: '/dashboard' },
    { Icon: Star, path: '/ratings' },
    { Icon: NotebookPen, path: '/journals' },
    { Icon: LayoutGrid, path: '/topsters' },
    { Icon: Compass, path: '/community' }
]
export const navbarDetailComponents: NavbarComponentProps[] = [
    { Icon: DiscAlbum, path: '/detail/album' },
    { Icon: Music, path: '/detail/track' },
    { Icon: SquareUser, path: '/detail/artist' }
]
export default function Navbar() {
    
    const { navbarAuth } = useNavbarAuth()
    return (
        <div>
            <nav className='h-full shrink-0 pr-4 py-2 text-white md:flex hidden flex-col gap-y-5 justify-start items-center'>
                <NavigationBar.Group components={navbarMainComponents}/>
                {navbarAuth}
                {/*<NavigationBar.Group components={navbarDetailComponents}/>*/}
            </nav>
            <nav className='w-full shrink-0 md:hidden flex'>
                <NavigationBar.Mobile/>
            </nav>
        </div>
    )
}