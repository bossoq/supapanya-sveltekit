<script lang="ts">
  import TipTapView from '$lib/components/TipTapView.svelte'
  import { toastsList } from '$lib/store'
  import type { JSONContent } from '@tiptap/core'
  import type { PageServerData } from './$types'

  export let data: PageServerData
  const { user, props } = data
  let editMode = false

  const handleSave = async (payload: JSONContent) => {
    const response = await fetch('/api/courseUpdate', {
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
      content = data.course.postContent
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
          textAlign: 'left',
          level: 1
        },
        content: [
          {
            type: 'text',
            text: 'คอร์สปิดเทอม 2563'
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
                    type: 'heading',
                    attrs: {
                      textAlign: 'left',
                      level: 2
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'คอร์สสอบเข้า ม.1'
                      }
                    ]
                  },
                  {
                    type: 'image',
                    attrs: {
                      src: 'https://ceoyctjctahurvmlupfh.supabase.in/storage/v1/object/public/supapanya-assets/course-images/Page Post 048-summer-Course63_3.jpg',
                      alt: null,
                      title: null,
                      aspect: '2/3'
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
                    type: 'heading',
                    attrs: {
                      textAlign: 'left',
                      level: 2
                    },
                    content: [
                      {
                        type: 'text',
                        text: 'คอร์สเสริมทักษะ (ประถม)'
                      }
                    ]
                  },
                  {
                    type: 'image',
                    attrs: {
                      src: 'https://ceoyctjctahurvmlupfh.supabase.in/storage/v1/object/public/supapanya-assets/course-images/Page%20Post%20049-summer-Course63_4.jpg',
                      alt: null,
                      title: null,
                      aspect: '2/3'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
  let content = (props.course as JSONContent) ?? defaultContent
</script>

<svelte:head>
  <title>คอร์สเรียน - สถาบันศุภปัญญาไอ.เค.</title>
</svelte:head>

<div class="flex flex-col items-center bg-white gap-6 h-[calc(100vh-10.2rem)]">
  <div class="container flex flex-col">
    <TipTapView bind:content bind:editMode editable={user?.meta.isAdmin} {handleSave} />
  </div>
</div>
