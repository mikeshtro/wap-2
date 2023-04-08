import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import MainWindow from './mainWindow/mainWindow'

export default function Home() {
  return (
    <>
      <Head>
        <title>WAP 2</title>
        <meta name="description" content="FIT VUT WAP project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <MainWindow/>
      </main>
    </>
  )
}
