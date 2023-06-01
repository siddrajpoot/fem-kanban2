/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import styles from '@/styles/index.module.scss'
import { type NextPage } from 'next'
import Head from 'next/head'
import { useAtom, useSetAtom } from 'jotai'

import { type TasksType, type ColumnsType, MODAL_ACTION } from '@/types'
import { modalActionAtom } from '@/jotai/modal'
import { selectedTaskIndexAtom } from '@/jotai/tasks'
import { boardSelecter } from '@/jotai/board'
import { getCompletedSubtasks } from '@/utils/helpers'

const Home: NextPage = () => {
  const [selectedBoard] = useAtom(boardSelecter)
  const setModalAction = useSetAtom(modalActionAtom)
  const setSelectedTaskIndex = useSetAtom(selectedTaskIndexAtom)

  const handleTaskClick = (columnIndex: number, taskIndex: number) => {
    setModalAction(MODAL_ACTION.VIEW_TASK)
    setSelectedTaskIndex({ columnIndex, taskIndex })
  }

  const renderColumns = (columns?: ColumnsType) => {
    return (
      <>
        {columns?.map((column, columnIndex) => (
          <div key={column.name} className={styles.column}>
            <p className={styles.columnTitle}>
              {column.name} ({column.tasks.length})
            </p>

            {renderTasks(column.tasks, columnIndex)}
          </div>
        ))}
        <div className={styles.newColumn}>+ New Column</div>
      </>
    )
  }

  const renderTasks = (tasks: TasksType, columnIndex: number) => {
    return tasks.map((task, taskIndex) => {
      const numberOfSubtasks = task.subtasks.length
      const numberOfCompleted = getCompletedSubtasks(task.subtasks)

      return (
        <div
          key={task.title}
          className={styles.task}
          onClick={() => handleTaskClick(columnIndex, taskIndex)}
        >
          <p className={styles.taskTitle}>{task.title}</p>
          <p className={styles.subtask}>
            {numberOfCompleted} of {numberOfSubtasks} subtasks
          </p>
        </div>
      )
    })
  }

  return (
    <>
      <Head>
        <title>Kanban</title>
      </Head>

      <div className={styles.board}>
        {renderColumns(selectedBoard?.columns)}
      </div>
    </>
  )
}

export default Home
