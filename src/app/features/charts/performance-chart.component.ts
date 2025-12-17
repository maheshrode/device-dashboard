import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { DeviceEvent } from '../devices/device-event.model';

@Component({
  selector: 'app-performance-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-full h-[300px] bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div class="w-full h-[240px]" #chartContainer></div>
    </div>
  `,
})
export class PerformanceChartComponent implements OnChanges {
  @Input() data: DeviceEvent[] = [];
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 40 };
  private width = 0;
  private height = 0;

  ngOnChanges() {
    this.createChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.createChart();
  }

  private createChart() {
    if (!this.data || this.data.length === 0 || !this.chartContainer) return;

    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove();

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${element.offsetWidth} ${element.offsetHeight}`)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // X Axis (Time)
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(this.data, (d) => new Date(d.timestamp)) as [Date, Date]
      )
      .range([0, this.width]);

    this.svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d: any) => d3.timeFormat('%H:%M:%S')(d))
      )
      .style('color', '#9CA3AF');

    // Y Axis (PPM)
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.partsPerMinute) || 120])
      .range([this.height, 0]);

    this.svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('color', '#9CA3AF')
      .call((g: any) => g.select('.domain').remove())
      .call((g: any) =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', this.width)
          .attr('stroke-opacity', 0.1)
      );

    // Line Path
    this.svg
      .append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d3
          .line<DeviceEvent>()
          .x((d) => x(new Date(d.timestamp)))
          .y((d) => y(d.partsPerMinute))
          .curve(d3.curveMonotoneX)
      );

    // Area Path (Gradient)
    const area = d3
      .area<DeviceEvent>()
      .x((d) => x(new Date(d.timestamp)))
      .y0(this.height)
      .y1((d) => y(d.partsPerMinute))
      .curve(d3.curveMonotoneX);

    const gradient = this.svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'areaGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0.2);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3B82F6')
      .attr('stop-opacity', 0);

    this.svg
      .append('path')
      .datum(this.data)
      .attr('fill', 'url(#areaGradient)')
      .attr('d', area);
  }
}
