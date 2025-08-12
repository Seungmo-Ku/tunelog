const ja = {
    tunelog: 'Tunelog',
    ratings: {
        new_rating: '新しい評価',
        no_rating_yet: 'まだ評価がありません',
        leave_rating: 'お気に入りの音楽に評価を残しましょう！',
        card: {
            delete: '削除',
            edit: '編集',
            my_rating: '自分の評価'
        },
        edit_dialog: {
            title: '評価を編集',
            public: '公開評価（全員が見られます）',
            private: '非公開評価（自分だけが見られます）',
            update: '評価を更新',
            update_success: '評価を更新しました',
            update_error: '評価の更新に失敗しました'
        },
        new_rating_dialog: {
            comment: 'コメント',
            create_rating: '新しい評価を作成！'
        }
    },
    journals: {
        new_journal: '新しいジャーナル',
        no_journal_yet: 'まだジャーナルがありません',
        leave_journal: 'お気に入りの音楽について最初のジャーナルを書きましょう！',
        create: {
            title: 'タイトル',
            upload: 'アップロード',
            update: '更新',
            tags: 'タグ（任意）',
            tags_1: '天気？（例: 晴れ、雨）',
            tags_2: '気分？（例: 嬉しい、悲しい）',
            tags_3: 'シーン？（例: ビーチ、山）',
            tags_4: 'その他？（例: カスタムタグ）',
            public: '公開ジャーナル（全員が見られます）',
            private: '非公開ジャーナル（自分だけが見られます）'
        }
    },
    topsters: {
        new_topster: '新しいTopster',
        no_topster_yet: 'まだTopsterがありません',
        leave_topster: '最初のTopsterを作って他の人とシェアしましょう！',
        save_as_image: '画像として保存',
        create: {
            empty_slot: '空きスロット',
            add_item: 'アイテムを追加',
            title: 'タイトル',
            enter_title: 'タイトルを入力',
            size: 'サイズ',
            show_item_titles: 'アイテムのタイトルを表示',
            show_item_types: 'アイテムのタイプを表示',
            public: '公開Topster（全員が見られます）',
            private: '非公開Topster（自分だけが見られます）'
        }
    },
    mutation_object: {
        description: `この操作は{{type}}を{{action}}し、元に戻せません。`,
        deletion_success: '{{type}}を削除しました。',
        deletion_error: '{{type}}の削除に失敗しました。もう一度お試しください。',
        update_success: '{{type}}を更新しました。',
        update_error: '{{type}}の更新に失敗しました。もう一度お試しください。',
        action: '{{action}} {{type}}'
    },
    likes: {
        guest: 'ログイン後にいいねを押してください！',
        error: 'いいねの操作に失敗しました'
    },
    notify: {
        followed: '{{ name }}があなたをフォローし始めました。',
        following: 'あなたは{{ name }}をフォローし始めました。',
        new_from_following: '{{ name }}さんの新しい{{ type }}',
        new_comment: '{{ name }}さんがあなたの{{ type }}にコメントしました。',
        new_like: '{{ name }}さんがあなたの{{ type }}にいいねしました。'
    },
    keywords: {
        rating: '評価',
        journal: 'ジャーナル',
        topster: 'Topster',
        album: 'アルバム',
        artist: 'アーティスト',
        track: 'トラック',
        all: 'すべて',
        newest: '新しい順',
        oldest: '古い順',
        created: '作成日時',
        last_edited: '最終編集',
        delete: '削除',
        update: '更新',
        create: '作成',
        edit: '編集',
        public: '公開',
        private: '非公開'
    }
}

export default ja
