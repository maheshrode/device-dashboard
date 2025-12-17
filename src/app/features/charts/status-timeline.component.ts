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

interface StatusSegment {
  status: string;
  startTime: Date;
  endTime: Date;
}

@Component({
  selector: 'app-status-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="w-full h-[200px] bg-white rounded-xl shadow-sm border border-gray-100 p-4"
    >
      <div class="w-full h-[140px]" #chartContainer></div>
    </div>
  `,
})
export class StatusTimelineComponent implements OnChanges {
  @Input() data: DeviceEvent[] = [];
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private svg: any;
  private margin = { top: 20, right: 20, bottom: 30, left: 70 };

  ngOnChanges() {
    this.createChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.createChart();
  }

  private processData(): StatusSegment[] {
    if (!this.data || this.data.length === 0) return [];

    const segments: StatusSegment[] = [];
    let currentSegment: StatusSegment | null = null;

    // Sort by timestamp just in case
    const sortedData = [...this.data].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sortedData.forEach((event, index) => {
      const time = new Date(event.timestamp);

      if (!currentSegment) {
        currentSegment = {
          status: event.status,
          startTime: time,
          endTime: time,
        };
      } else if (currentSegment.status !== event.status) {
        // Status changed, close current segment
        currentSegment.endTime = time;
        segments.push(currentSegment);
        currentSegment = {
          status: event.status,
          startTime: time,
          endTime: time,
        };
      } else {
        // Continue segment
        currentSegment.endTime = time;
      }

      // Push last segment
      if (index === sortedData.length - 1 && currentSegment) {
        segments.push(currentSegment);
      }
    });

    return segments;
  }

  private createChart() {
    if (!this.data || this.data.length === 0 || !this.chartContainer) return;

    const element = this.chartContainer.nativeElement;
    d3.select(element).select('svg').remove();

    const width = element.offsetWidth - this.margin.left - this.margin.right;
    const height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const segments = this.processData();

    if (segments.length === 0) return;

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
      .domain([
        d3.min(segments, (d) => d.startTime) as Date,
        d3.max(segments, (d) => d.endTime) as Date,
      ])
      .range([0, width]);

    this.svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d: any) => d3.timeFormat('%H:%M:%S')(d))
      )
      .style('color', '#9CA3AF');

    // Y Axis (Categories)
    const statuses = ['running', 'stopped', 'maintenance'];
    const y = d3.scaleBand().domain(statuses).range([height, 0]).padding(0.4);

    this.svg
      .append('g')
      .call(d3.axisLeft(y))
      .style('color', '#9CA3AF')
      .call((g: any) => g.select('.domain').remove());

    // Color Scale
    const color = d3
      .scaleOrdinal()
      .domain(statuses)
      .range(['#22c55e', '#eab308', '#ef4444']); // Tailwaind green-500, yellow-500, red-500

    // Draw Bars
    this.svg
      .selectAll('rect')
      .data(segments)
      .enter()
      .append('rect')
      .attr('x', (d: StatusSegment) => x(d.startTime))
      .attr('y', (d: StatusSegment) => y(d.status) || 0)
      .attr('width', (d: StatusSegment) =>
        Math.max(1, x(d.endTime) - x(d.startTime))
      )
      .attr('height', y.bandwidth())
      .attr('fill', (d: StatusSegment) => color(d.status) as string)
      .attr('rx', 4);
  }
}
