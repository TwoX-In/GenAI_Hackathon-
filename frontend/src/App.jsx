import React from 'react';
import { Upload, Palette, User, FileText, Sparkles, ChevronRight, Star, Globe } from 'lucide-react';
import './index.css';
// import Form from './components/form/form';
import { LandingPageHero } from './scenes/landing_page/hero';
import { Header } from './components/header/header';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AssetSubmission } from './scenes/asset_submission/asset_submission';
import { AssetGen } from './scenes/asset_generation/asset_gen';
import { ProductListing } from './scenes/product_listing/product_listing';
import { ProductsShowcase } from './scenes/products_showcase/products_showcase';
import { Team } from './scenes/team/team';
import { Features } from './scenes/features/features';
import { Contact } from './scenes/contact/contact';
import { MetadataLoader } from './loader/asset_loader';
import InventoryForm from './components/inventory/inventory_form';
import { ProductLoader } from './loader/product_loader';
import AITools from './scenes/ai-tools/ai-tools';
import ARExperience from './components/ar/ARExperience';


function Layout() {
  return (
    <div className="flex flex-col">

      <Header />
      <Outlet />
    </div>
  );
}
const router = createBrowserRouter([
  {

    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <LandingPageHero />
      },
      {
        path: "form",
        element: <AssetSubmission />
      },
      {
        path: "asset_gen/:id",
        element: <AssetGen />,
        loader: MetadataLoader
      },
      {
        path:"inventory",
        element: <InventoryForm/>
      },
      {
        path: "product_listing/:id",
        element: <ProductListing />,
        loader: ProductLoader
      },
      {
        path: "products",
        element: <ProductsShowcase />
      },
      {
        path: "team",
        element: <Team />
      },
      {
        path: "features",
        element: <Features />
      },
      {
        path: "contact",
        element: <Contact />
      },
      {
        path: "ai-tools",
        element: <AITools />
      },
      {
        path: "ar-experience",
        element: <ARExperience />
      },

    ]

  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
};

export default App;