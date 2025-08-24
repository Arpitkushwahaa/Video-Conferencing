import MainMenu from "@/components/MainMenu"
import StatusBar from "@/components/StatusBar"
import Footer from "@/components/Footer"

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-col gap-32 pt-20 pl-10 items-center max-md:gap-10 md:flex-row animate-fade-in">
                <StatusBar/>
                <MainMenu/>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage