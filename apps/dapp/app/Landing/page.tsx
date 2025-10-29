import Intro from '@/components/Displays/Intro';
import Signin from '@/components/Signin';
import PageLayout from '@/components/Layouts/PageLayout';
import React from 'react'

const LandingPage = () => {
  return (
    <PageLayout visible={true}>
      <Intro />
      <Signin />
    </PageLayout>
  )
}

export default LandingPage;