<script lang="ts">
  import TipTapRender from '$lib/components/TipTapRender.svelte'
  import { toastsList } from '$lib/store'
  import type { JSONContent } from '@tiptap/core'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  const { user, props } = data
  let editMode = false

  const handleSave = async (payload: JSONContent) => {
    const response = await fetch('/api/reviewUpdate', {
      method: 'POST',
      body: JSON.stringify({
        authorId: user?.id,
        postContent: payload
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (data.success) {
      content = data.review.postContent
      editMode = false
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'บันทึกข้อมูลสำเร็จ',
          type: 'success'
        }
      ])
    } else {
      toastsList.update((toasts) => [
        ...toasts,
        {
          uuid: Math.random().toString(36).substring(2),
          message: 'บันทึกข้อมูลไม่สำเร็จ',
          type: 'error'
        }
      ])
    }
  }
  const defaultContent: JSONContent = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
          textAlign: 'left'
        },
        content: [
          {
            text: 'รีวิวจากผู้ปกครอง',
            type: 'text'
          }
        ]
      },
      {
        type: 'table',
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: {
                  colspan: 1,
                  rowspan: 1,
                  colwidth: null
                },
                content: [
                  {
                    type: 'image',
                    attrs: {
                      alt: null,
                      src: 'https://ceoyctjctahurvmlupfh.supabase.in/storage/v1/object/public/supapanya-assets/review-images/001-1.jpg',
                      title: null,
                      aspect: null
                    }
                  }
                ]
              },
              {
                type: 'tableCell',
                attrs: {
                  colspan: 1,
                  rowspan: 1,
                  colwidth: null
                },
                content: [
                  {
                    type: 'image',
                    attrs: {
                      alt: null,
                      src: 'https://ceoyctjctahurvmlupfh.supabase.in/storage/v1/object/public/supapanya-assets/review-images/001-2.jpg',
                      title: null,
                      aspect: null
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'heading',
            attrs: {
              level: 2,
              textAlign: 'left'
            },
            content: [
              {
                text: '“ทางสถาบันศุภปัญญา ไอ.เค. ขอขอบพระคุณคุณแม่น้องเนม (ด.ช.พีระวิชญ์ สังข์กลม) เป็นอย่างสูง ที่ให้ความไว้วางใจในสถาบันฯ ในการสนับสนุน อบรมสั่งสอน ทั้งด้านวิชาการ และด้านสังคม เพื่อให้น้องเนมเป็นทั้งคนเก่ง และคนดี ทั้งในครอบครัว โรงเรียน และประเทศ”',
                type: 'text',
                marks: [
                  {
                    type: 'bold'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  let content = (props.review as JSONContent) ?? defaultContent
</script>

<svelte:head>
  <title>รีวิว - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  <div class="container flex flex-col">
    <TipTapRender bind:content bind:editMode editable={user?.meta.isAdmin} {handleSave} />
  </div>
</div>
