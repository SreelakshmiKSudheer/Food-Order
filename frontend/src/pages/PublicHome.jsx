import React from 'react'
import Card from '../components/Card'

const PublicHome = () => {
  return (
    <div>
        <h1>Welcome to the Food Order App</h1>
        <p>Order your favorite food from the best restaurants.</p>
        <Card 
        title="Pazhampori" 
        description="Delicious banana fritters" 
        image="https://t4.ftcdn.net/jpg/09/97/82/31/360_F_997823124_MH2XFXDaAN3UNEdg67wyFPWxNuFEl0Ct.jpg" 
        price={12} 
        category="Snack" 
        type="NonVeg" 
        availableQuantity={0} />
    </div>
  )
}

export default PublicHome