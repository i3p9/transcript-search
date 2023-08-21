import React from 'react';
import styles from './Skeleton.module.css'

function OcularPatdown() {
  const ocularPatdownPath = `${window.location.hostname}/images/patdown.jpeg`
  return <img className={styles.ocularPatdownImage} src={ocularPatdownPath} alt="mac doing ocular patdown" />
}

function Skeleton() {
  return (
    <>
      <div role="status" class="animate-pulse py-5 px-5">
        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        <span class="sr-only">Loading...</span>
      </div>
      <OcularPatdown />
    </>
  );
}

export default Skeleton;
