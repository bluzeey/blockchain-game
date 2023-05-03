import { Container, Flex, Heading, Link } from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function NavBar() {
    return (
        <Container style={{background:"black"}} maxW={"1200px"} py={4}>
            <Flex direction={"row"} justifyContent={"space-between"}>
                <Heading fontFamily={'cursive'} color='whiteAlpha.900'>Reaper's Harvest</Heading>
                <Flex alignItems={"center"}>
                    <Link color='whiteAlpha.900' href={"/"} mx={2}>Play</Link>
                    <Link color='whiteAlpha.900' href={"/shop"} mx={2}>Shop</Link>
                </Flex>
                <ConnectWallet/>
            </Flex>
        </Container>
    )
};