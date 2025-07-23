const ko = {
    tunelog: '튠로그',
    ratings: {
        new_rating: '새 레이팅',
        no_rating_yet: '아직 레이팅이 없어요',
        leave_rating: '좋아하는 음악에 레이팅을 남겨보세요!',
        card: {
            delete: '삭제',
            edit: '편집',
            my_rating: '내 레이팅'
        },
        edit_dialog: {
            title: '레이팅 편집',
            public: '공개',
            private: '비공개',
            update: '레이팅 업데이트',
            update_success: '레이팅이 성공적으로 업데이트 되었어요',
            update_error: '레이팅 업데이트에 실패했어요. 다시 시도해주세요.'
        },
        new_rating_dialog: {
            comment: '한줄평',
            create_rating: '새로운 레이팅 만들기!'
        }
    },
    journals: {
        new_journal: '새 저널',
        no_journal_yet: '아직 저널이 없어요',
        leave_journal: '좋아하는 음악에 대한 첫 저널을 작성해보세요!',
        create: {
            title: '제목',
            upload: '업로드',
            update: '업데이트',
            tags: '태그 (선택사항)',
            tags_1: '날씨가 어땠나요?',
            tags_2: '기분이 어땠나요?',
            tags_3: '생각나는 장소가 있나요?',
            tags_4: '그 외에 생각나는 것?',
            public: '공개',
            private: '비공개'
        }
    },
    topsters: {
        new_topster: '새 탑스터',
        no_topster_yet: '아직 탑스터가 없어요',
        leave_topster: '첫 탑스터를 만들어 다른 사람들과 공유해보세요!',
        save_as_image: '이미지로 저장하기',
        create: {
            empty_slot: '빈 슬롯',
            add_item: '아이템 추가',
            title: '제목',
            enter_title: '제목을 입력해주세요',
            size: '크기',
            show_item_titles: '아이템의 제목을 표시할까요?',
            show_item_types: '아이템의 종류를 표시할까요? (track, album, artist)',
            public: '공개',
            private: '비공개'
        }
    },
    mutation_object: {
        description: `이 작업은 {{type}}을(를) {{action}} 하고 되돌릴 수 없어요`,
        deletion_success: '{{type}}이(가) 성공적으로 삭제되었어요.',
        deletion_error: `{{type}}을(를) 삭제하는 데 실패했어요. 다시 시도해주세요.`,
        update_success: '{{type}}이(가) 성공적으로 업데이트되었어요.',
        update_error: `{{type}}을(를) 업데이트하는 데 실패했어요. 다시 시도해주세요.`,
        action: '{{type}} {{action}}'
    },
    likes: {
        guest: '로그인 후 좋아요를 눌러주세요!',
    },
    keywords: {
        rating: '레이팅',
        journal: '저널',
        topster: '탑스터',
        album: '앨범',
        artist: '아티스트',
        track: '트랙',
        all: 'All',
        newest: '최신순',
        oldest: '오래된순',
        created: '생성 일시: ',
        last_edited: '최종 업데이트',
        delete: '제거',
        update: '업데이트',
        create: '생성',
        edit: '편집',
        public: '공개',
        private: '비공개'
    }
}

export default ko