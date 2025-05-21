import './App.css'
import { Card, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'

function App() {


  return (
    <>
      <header className='flex flex-col gap-4'>
        <h1 className='text-3xl font-bold'>My Cards</h1>
        <Input placeholder='Search' onChange={() => { }} />
      </header>
      <main className='mt-5'>
        <Card className='w-full flex'>
          <CardHeader>
            <CardTitle className='flex'>Driver's license <img src="/assets/lto.png" /></CardTitle>
          </CardHeader>
        </Card>
        {/* <h1 className='text-md font-semibold tracking-tight m-3'>Driver's License</h1><img src="/assets/lto.png" /> */}
      </main >
    </>
  )
}

export default App
