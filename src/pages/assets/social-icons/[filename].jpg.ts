import type MDInstance from '@app-types/MDInstance';
import type { APIRoute } from 'astro';
import { CanvasRenderingContext2D, createCanvas } from 'canvas';

export const getStaticPaths = async () => {
  // const allPosts = await Astro.glob<MDInstance>('../../pages/posts/*.{md,mdx}');
  return [{ params: { filename: 'Dan Spratiling Freelance developer & designer' } }];
};

export const get: APIRoute = ({ params, request }) => {
  function roundRect(param: {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number;
    fill?: boolean;
    stroke?: boolean;
  }) {
    let stroke, radius;
    const { ctx, x, y, width, height, fill } = param;
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side as keyof typeof defaultRadius];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  //define canvas size
  let width = 1200;
  let height = 630;

  //draw canvas
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  //Fill the background
  context.fillStyle = '#68d391';
  context.fillRect(0, 0, width, height);

  //readjust width and height
  width = width - 50;
  height = height - 50;

  //fill an inner container to simulate a border
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 25;
  context.shadowColor = 'rgba(0,0,0,0.7)';
  context.fillStyle = '#000';
  roundRect({ ctx: context, x: 25, y: 25, width, height, radius: 15, fill: true, stroke: false });

  //set the copy style
  context.font = 'bold 82pt SimSun';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.fillStyle = '#fff';

  //readjust width and height again
  width = width - 50;
  height = height - 50;
  const title = params.filename!;
  //redraw the title over multiple lines
  const words = title.split(' ');
  let line = '';
  let fromTop = 70;
  words.forEach((word) => {
    let testLine = line + word + ' ';
    if (context.measureText(testLine).width > width) {
      context.fillText(line.trim(), 60, fromTop);
      line = word + ' ';
      fromTop = fromTop + 125;
    } else {
      line = line + word + ' ';
    }
  });
  context.fillText(line.trim(), 60, fromTop);

  //insert domain
  context.fillStyle = '#ccc';
  context.font = 'bold 24pt SimSun';
  context.fillText('danspratling.dev', 60, 540);

  //insert handle
  context.fillStyle = '#ccc';
  context.font = 'bold 24pt SimSun';
  context.textAlign = 'right';
  context.fillText('@dan_spratling', 1140, 540);

  //export image
  const buffer = canvas.toBuffer('image/jpeg');
  return { body: buffer, encoding: 'binary' };
};