import type { GridProps } from '@chakra-ui/react';
import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  Skeleton,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
/* eslint-disable */
import { DiscordIcon } from "icons/Discord";
import { GithubIcon } from "icons/Github";
import { MediumIcon } from "icons/Medium";
import { TelegramIcon } from "icons/Telegram";
import { TwitterIcon } from "icons/Twitter";
import type { ResourceError } from "lib/api/resources";
import useApiQuery from "lib/api/useApiQuery";
import useFetch from "lib/hooks/useFetch";
import NetworkAddToWallet from "ui/shared/NetworkAddToWallet";

import FooterLinkItem from "./FooterLinkItem";
import IntTxsIndexingStatus from "./IntTxsIndexingStatus";
import getApiVersionUrl from "./utils/getApiVersionUrl";

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${config.UI.footer.frontendVersion}`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${config.UI.footer.frontendCommit}`;

const Footer = () => {
  const { data: backendVersionData } = useApiQuery("config_backend_version", {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);

  const BLOCKSCOUT_LINKS = [
    {
      icon: <TelegramIcon />,
      url: "https://t.me/CrustNetwork",
    },
    {
      icon: <MediumIcon />,
      url: "https://crustnetwork.medium.com/",
    },
    {
      icon: <TwitterIcon />,
      url: "https://twitter.com/CrustNetwork",
    },
    {
      icon: <GithubIcon />,
      url: "https://github.com/crustio",
    },
    {
      icon: <DiscordIcon />,
      url: "https://discord.com/invite/Jbw2PAUSCR",
    },
  ];

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return (
        <Link href={FRONT_VERSION_URL} target="_blank">
          {config.UI.footer.frontendVersion}
        </Link>
      );
    }

    if (config.UI.footer.frontendCommit) {
      return (
        <Link href={FRONT_COMMIT_URL} target="_blank">
          {config.UI.footer.frontendCommit}
        </Link>
      );
    }

    return null;
  })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: ["footer-links"],
    queryFn: async () =>
      fetch(config.UI.footer.links || "", undefined, {
        resource: "footer-links",
      }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData
    ? 1
    : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(
    (gridArea?: GridProps["gridArea"]) => {
      return (
        <Flex
          gridArea={gridArea}
          flexWrap="wrap"
          columnGap={8}
          rowGap={6}
          mb={{ base: 5, lg: 10 }}
          _empty={{ display: "none" }}
        >
          {!config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus />}
          <NetworkAddToWallet />
        </Flex>
      );
    },
    []
  );

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps["gridArea"]) => {
      return (
        <Box gridArea={gridArea}>
          <Link fontSize="xs" href="https://ethda.io/">
            ethda.io
          </Link>
          <Text mt={3} fontSize="xs">
            EthDA is a scalable Ethereum layer2 Data Availability solution.
          </Text>
        </Box>
      );
    },
    [apiVersionUrl, backendVersionData?.backend_version, frontendLink]
  );

  const containerProps: GridProps = {
    as: "footer",
    px: { base: 4, lg: 12 },
    py: { base: 4, lg: 9 },
    borderTop: "1px solid",
    borderColor: "divider",
    gridTemplateColumns: { base: "1fr", lg: "minmax(auto, 470px) 1fr" },
    columnGap: { lg: "32px", xl: "100px" },
  };

  if (config.UI.footer.links) {
    return (
      <Grid {...containerProps}>
        <div>
          {renderNetworkInfo()}
          {renderProjectInfo()}
        </div>

        <Grid
          gap={{
            base: 6,
            lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
            xl: 12,
          }}
          gridTemplateColumns={{
            base: "repeat(auto-fill, 160px)",
            lg: `repeat(${colNum}, 135px)`,
            xl: `repeat(${colNum}, 160px)`,
          }}
          justifyContent={{ lg: "flex-end" }}
          mt={{ base: 8, lg: 0 }}
        >
          {[
            { title: "Blockscout", links: BLOCKSCOUT_LINKS },
            ...(linksData || []),
          ]
            .slice(0, colNum)
            .map((linkGroup) => (
              <Box key={linkGroup.title}>
                <Skeleton
                  fontWeight={500}
                  mb={3}
                  display="inline-block"
                  isLoaded={!isPlaceholderData}
                >
                  {linkGroup.title}
                </Skeleton>
                <VStack spacing={1} alignItems="start">
                  {linkGroup.links.map((link, i) => (
                    <FooterLinkItem
                      {...link}
                      key={`line_${i}`}
                      isLoading={isPlaceholderData}
                    />
                  ))}
                </VStack>
              </Box>
            ))}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      {...containerProps}
      gridTemplateAreas={{
        lg: `
          "network links-top"
          "info links-bottom"
        `,
      }}
    >
      {renderNetworkInfo({ lg: "network" })}
      {renderProjectInfo({ lg: "info" })}
      <Grid
        gridArea={{ lg: "links-bottom  ", md: 0 }}
        templateColumns={{ base: "repeat(5, 1fr)", md: "repeat(5, 1fr)" }}
        gap={4}
        display={{ base: "flex" }}
        width={{ base: "100%" }}
        justifyContent={{ base: "center", lg: "flex-end" }}
        marginBottom={{ base: "20px" }}
        mx={{ base: 0, md: "auto" }}
      >
        {BLOCKSCOUT_LINKS.map((link, i) => (
          <FooterLinkItem {...link} key={`line_${i}`} />
        ))}
      </Grid>
    </Grid>
  );
};

export default React.memo(Footer);
