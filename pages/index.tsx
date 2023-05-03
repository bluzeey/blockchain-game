import { ConnectWallet, MediaRenderer, Web3Button, useAddress, useContract, useContractRead, useContractWrite, useOwnedNFTs } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { FARMER_ADDRESS, REWARDS_ADDRESS, STAKING_ADDRESS, TOOLS_ADDRESS } from "../const/addresses";
import { ClaimFarmer } from "../components/ClaimFarmer";
import { Inventory } from "../components/Inventory";
import { Equipped } from "../components/Equipped";
import { BigNumber, ethers } from "ethers";
import { Text, Box, Card, Container, Flex, Heading, SimpleGrid, Spinner, Stack, Skeleton } from "@chakra-ui/react";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract: farmercontract } = useContract(FARMER_ADDRESS);
  const { contract: toolsContract } = useContract(TOOLS_ADDRESS);
  const { contract: stakingContract } = useContract(STAKING_ADDRESS);
  const { contract: rewardContract } = useContract(REWARDS_ADDRESS);

  const { data: ownedFarmers, isLoading: loadingOwnedFarmers } = useOwnedNFTs(farmercontract, address);
  const { data: ownedTools, isLoading: loadingOwnedTools } = useOwnedNFTs(toolsContract, address);

  const { data: equippedTools } = useContractRead(
    stakingContract, 
    "getStakeInfo",
    [address]
  );

  const { data: rewardBalance } = useContractRead(rewardContract, "balanceOf", [address]);
  
  if (!address) {
    return (
      <Container maxW={"1200px"}>
        <Flex direction={"column"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Heading my={"40px"}>Reaper's Harvest</Heading>
          <ConnectWallet />
        </Flex>
      </Container>
    );
  }

  if (loadingOwnedFarmers) {
    return(
      <Container maxW={"1200px"}>
        <Flex h={"100vh"} justifyContent={"center"} alignItems={"center"}>
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (ownedFarmers?.length === 0) {
    return (
      <Container maxW={"1200px"}>
        <ClaimFarmer />
      </Container>
    );
  }

  return (
    <Container maxW={"1200px"}>
      <SimpleGrid columns={2} spacing={10}>
        <Card marginTop={5} p={5}>
          <Heading fontWeight={600} marginBottom={5}>Reaper:</Heading>
          <SimpleGrid columns={2} spacing={10}>
            <Box>
              {ownedFarmers?.map((nft) => (
                <div key={nft.metadata.id}>
                  <MediaRenderer 
                    src={nft.metadata.image} 
                    height="100%"
                    width="100%"
                  />
                </div>
              ))}
            </Box>
            <Box>
              <Text fontSize={"small"} fontWeight={"bold"}>$SOULS Balance:</Text>
                {rewardBalance && (
                    <p>{ethers.utils.formatUnits(rewardBalance, 18)}</p>
                  )}
              </Box>
          </SimpleGrid>
        </Card>
        <Card marginTop={5} p={5}>
          <Heading fontWeight={600} marginBottom={5}>Inventory:</Heading>
          <Skeleton isLoaded={!loadingOwnedTools}>
            <Inventory
              nft={ownedTools}
            />     
          </Skeleton>
        </Card>
      </SimpleGrid>
      <Card p={5} my={10}>
        <Heading fontWeight={500} mb={"30px"}>Equiped Tools:</Heading>
        <SimpleGrid columns={3} spacing={10}>
            {equippedTools &&
              equippedTools[0].map((nft: BigNumber) => (
                <Equipped
                  key={nft.toNumber()}
                  tokenId={nft.toNumber()}
                />
              ))}
        </SimpleGrid>
      </Card>
      <canvas id="base" width="500" height="500"></canvas>
    </Container>
  );
 };
// var c = document.getElementById('base');
// var ctx = c.getContext('2d');

// var creatures = [];

// var tailModifierLeft = {
// 	val: 10,
// 	direction: true
// };

// var tailModifierRight = {
// 	val: -10,
// 	direction: false
// };

// var mousePosition = {
// 	x: 0,
// 	y: 0
// }

// setWindowSize();
// addEventListeners();
// createCreatures();
// draw();

// function setWindowSize(){
// 	c.width = window.innerWidth * 2;
// 	c.height = window.innerHeight * 2;
// }

// function addEventListeners(){
	
// 	window.addEventListener('resize', function(){
// 		setWindowSize();
// 	});
	
// 	window.addEventListener('mousemove', function(e){
// 		mousePosition.x = e.clientX * 2;
// 		mousePosition.y = e.clientY * 2;
// 	});
	
// }

// function createCreatures(){
// 	var total = 0;
	
// 	for (i = 0; i < 30; i++){
// 		for (f = 0; f < 15; f++){
// 			total += 1;
			
// 			creatures.push({
// 				id: total,
// 				x: i * 200,
// 				y: f * 230,
// 				color: 'rgb(0, 225, ' + parseInt((120 + ((total / 6)))) + ')'
// 			});
// 		}
// 	}
// }

// function draw(){
// 	tailModifierLeft.val = calcModifier(tailModifierLeft);
// 	tailModifierRight.val = calcModifier(tailModifierRight);
	
// 	clearBg();
	
// 	for (i = 0; i < creatures.length; i++){
// 		moveCreature(creatures[i], i);
// 		drawGhost(creatures[i]);
// 	}
	
// 	window.requestAnimationFrame(draw);
// }

// function moveCreature(creature, i){
// 	if(creatures[i].y < -40){
// 		creatures[i].y = 230 * 15;
// 	} else {
// 		creatures[i].y -= 1;
// 	}
	
// 	if(mousePosition.x - creature.x < 300 &&
// 		 mousePosition.x - creature.x > -300 &&
// 		 mousePosition.y - creature.y < 300 &&
// 		 mousePosition.y - creature.y > -300){
		
// 		var distanceX = mousePosition.x - creature.x;
// 		var distanceY = mousePosition.y - creature.y;
// 		var divisionMod = 5;
// 		var fleeSpeed = 3;
		
// 		if(distanceX < 0){
// 			creatures[i].x += fleeSpeed;
// 		} else {
// 			creatures[i].x -= fleeSpeed;
// 		}
		
// 		if(distanceY < 0){
// 			creatures[i].y += fleeSpeed;
// 		} else {
// 			creatures[i].y -= fleeSpeed;
// 		}
		
// 	}
// }

// function calcModifier(obj){
	
// 	if(obj.val > 10){
// 		obj.direction = false;
// 	} else if (obj.val < -10) {
// 		obj.direction = true;
// 	}
	
// 	if(obj.direction){
// 		return obj.val + .5;
// 	} else {
// 		return obj.val - .5;
// 	}
	
// }

// function clearBg(){
// 	ctx.fillStyle = 'rgb(50, 60, 70)';
// 	ctx.fillRect(0, 0, c.width, c.height);
// 	ctx.fill();
// }

// function drawGhost(ghost){
	
// 	ctx.beginPath();
	
// 	ctx.moveTo(ghost.x - 40, ghost.y + 40);
// 	ctx.lineTo(ghost.x - 40, ghost.y - 40);
// 	ctx.bezierCurveTo(ghost.x - 40, ghost.y - 100,
// 										ghost.x + 40, ghost.y - 100,
// 										ghost.x + 40, ghost.y - 40);
// 	ctx.lineTo(ghost.x + 40, ghost.y + 40);
	
// 	ctx.quadraticCurveTo(ghost.x + 20, (ghost.y + 40 + tailModifierLeft.val),
// 											ghost.x, ghost.y + 40);
	
// 	ctx.quadraticCurveTo(ghost.x - 20, (ghost.y + 40 + tailModifierRight.val),
// 											ghost.x -40, ghost.y + 40);
	
// 	ctx.closePath();
	
// 	ctx.fillStyle = ghost.color;
// 	ctx.fill();
	
// 	drawEye(ghost);
// }

// function drawEye(ghost){
	
// 	ctx.beginPath();
	
// 	ctx.arc(ghost.x, ghost.y - 35, 20, 0, Math.PI * 2);
	
// 	ctx.closePath();
	
// 	ctx.fillStyle = 'white';
// 	ctx.fill();
	
// 	drawPupil(ghost);
	
// }

// function drawPupil(ghost){
	
// 	var pupilX = ghost.x;
// 	var pupilY = ghost.y - 35;
	
// 	var offsetMouseY = mousePosition.y;
// 	var eyeY = ghost.y - 35;
	
// 	if(ghost.x - mousePosition.x < 10 && ghost.x - mousePosition.x > -10){
// 		pupilX = mousePosition.x;
// 	} else if (ghost.x - mousePosition.x < 10) {
// 		pupilX = ghost.x + 10;
// 	} else {
// 		pupilX = ghost.x - 10;
// 	}
	
// 	if(eyeY - offsetMouseY < 10 && eyeY - offsetMouseY > -10){
// 		pupilY = offsetMouseY;
// 	} else if (eyeY - offsetMouseY < 10) {
// 		pupilY = eyeY + 10;
// 	} else {
// 		pupilY = eyeY - 10;
// 	}
	
// 	ctx.beginPath();
// 	ctx.arc(pupilX, pupilY, 8, 0, Math.PI * 2);
// 	ctx.closePath();
	
// 	ctx.fillStyle = 'black';
// 	ctx.fill();
	
// }
export default Home;
