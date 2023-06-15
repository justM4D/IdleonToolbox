import React from 'react';
import { cleanUnderscore, prefix } from 'utility/helpers';
import styled from '@emotion/styled';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Tooltip from 'components/Tooltip';
import ItemDisplay from 'components/common/ItemDisplay';
import Box from '@mui/material/Box';

const shapes = {
  'Circle': '1',
  'Square': '2',
  'Hexagon': '3',
  'Sparkle': '4'
};

const getImgName = (name, rawName, shape) => {
  switch (true) {
    case rawName.includes('Locked'): {
      return `ObolLocked${shapes[shape]}`;
    }
    case rawName.includes('Blank'): {
      return `ObolEmpty${shapes[shape]}`;
    }
    default: {
      return rawName;
    }
  }
};

const ObolsView = ({ obols, type = 'character', obolStats }) => {
  if (!obols) return;
  return (
    <ObolsStyled>
      {!obolStats ? <>
          <Card variant={'outlined'} sx={{ border: type === 'account' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)' }}>
            <CardContent sx={{ '&:last-child': { padding: type === 'account' ? 0 : 2 } }}>
              {(type === 'character' ? [5, 9, 12, 16, 23] : [5, 10, 14, 19, 24]).map((endInd, rowNumber, array) => {
                const startInd = rowNumber === 0 ? 0 : array[rowNumber - 1];
                const relevantArray = obols?.list?.slice(startInd, endInd);
                return <div className={'obol-row'} key={startInd + rowNumber}>
                  {relevantArray?.map((item, index) => {
                    const { displayName, rawName, levelReq, shape } = item;
                    const imgName = getImgName(displayName, rawName, shape);
                    return <div className={'obol-wrapper'} key={rawName + '' + index}>
                      {levelReq && rawName.includes('Locked') ?
                        <Typography variant={'caption'} className={'lv-req'}>{levelReq}</Typography> : null}
                      <Tooltip title={displayName !== 'ERROR' ? <ItemDisplay {...item}/> : ''}>
                        <img key={displayName + "" + index} src={`${prefix}data/${imgName}.png`}
                             alt=""/>
                      </Tooltip>
                    </div>;
                  })}
                </div>
              })}
            </CardContent>
          </Card>
        </> :
        <Card variant={'outlined'}>
          <CardContent>
            <Stack gap={2} mt={2} ml={type === 'character' ? 1 : 7}>
              {Object.entries(obols?.stats)?.map(([stat, value], index) => {
                return <Stat key={`${stat}-${index}`}
                             {...({
                               statName: cleanUnderscore(stat),
                               personalBonus: value?.personalBonus,
                               familyBonus: value?.familyBonus
                             })} />;
              })}
            </Stack>
          </CardContent>
        </Card>}
    </ObolsStyled>
  );
};

const Stat = ({ statName, personalBonus, familyBonus }) => {
  return <Stack direction={'row'} justifyContent={'space-between'}>
    <Box>
      <Typography sx={{ width: 175, display: 'inline-block' }} variant={'body1'} mr={1}
                  component={'span'}>{statName}</Typography>
    </Box>
    <Box>
      <Typography mr={1} variant={'body1'} component={'span'}>{(personalBonus ?? 0) + (familyBonus ?? 0)}</Typography>
      (<Typography variant={'body1'} component={'span'} color={'#fdc96a'}>+{personalBonus ?? 0}</Typography>,
      <Typography variant={'body1'} component={'span'} color={'#5fb4f1'}>+{familyBonus ?? 0}</Typography>)
    </Box>
  </Stack>
}

const ObolsStyled = styled.div`
  max-width: 400px;

  .obol-row {
    text-align: center;
  }

  .obol-wrapper {
    position: relative;
    display: inline;

    .lv-req {
      position: absolute;
      font-weight: bold;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      text-shadow: 2px 2px 2px black;
    }
  }

  img {
    width: 48px;
    height: 48px;
  }
`;

export default ObolsView;
