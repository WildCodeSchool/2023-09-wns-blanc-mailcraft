import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MobileRedirectLink = ({ href, children }) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Détecter si l'utilisateur est sur mobile
        const checkIfMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        // Vérifier au chargement de la page et sur redimensionnement
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);
    
    const handleClick = (e) => {
        e.preventDefault();
        if (isMobile) {
            // Rediriger vers la page /redirection si mobile
            router.push("/redirection");
        } else {
            // Sinon, rediriger vers /template/creation
            router.push("/template/creation");
        }
    };

    return (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    );
};

export default MobileRedirectLink;
